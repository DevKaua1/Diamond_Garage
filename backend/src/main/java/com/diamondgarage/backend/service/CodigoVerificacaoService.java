package com.diamondgarage.backend.service;

import com.diamondgarage.backend.email.EmailService;
import com.diamondgarage.backend.model.CodigoVerificacao;
import com.diamondgarage.backend.model.Usuario;
import com.diamondgarage.backend.repository.CodigoVerificacaoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

import com.diamondgarage.backend.exception.RegraDeNegocioException;
import com.diamondgarage.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CodigoVerificacaoService {

    private static final int VALIDADE_MINUTOS = 10;
    private static final int PRIMEIRA_ESPERA_SEGUNDOS = 30;
    private static final int MAX_TENTATIVAS = 5;

    

    private final CodigoVerificacaoRepository codigoRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();
    private final UsuarioRepository usuarioRepository;

    public CodigoVerificacaoService(CodigoVerificacaoRepository codigoRepository,
                                    UsuarioRepository usuarioRepository,
                                    PasswordEncoder passwordEncoder,
                                    EmailService emailService) {
        this.codigoRepository = codigoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void criarEEnviar(Usuario usuario) {
        String codigo = gerarCodigo();
        Instant agora = Instant.now();

        CodigoVerificacao registro = new CodigoVerificacao(
                usuario,
                passwordEncoder.encode(codigo),
                agora.plus(Duration.ofMinutes(VALIDADE_MINUTOS)),
                agora.plus(Duration.ofSeconds(PRIMEIRA_ESPERA_SEGUNDOS)));

        codigoRepository.save(registro);
        emailService.enviarCodigo(usuario.getEmail(), codigo);
    }

        @Transactional(noRollbackFor = RegraDeNegocioException.class)
    public void verificar(String email, String codigoDigitado) {
        CodigoVerificacao registro = codigoRepository
                .findByUsuarioEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RegraDeNegocioException(
                        HttpStatus.BAD_REQUEST, "codigo", "Código incorreto."));

        Usuario usuario = registro.getUsuario();

        if (usuario.isEmailVerificado()) {
            throw new RegraDeNegocioException(
                    HttpStatus.CONFLICT, "email", "Este e-mail já foi verificado.");
        }

        if (registro.getTentativas() >= MAX_TENTATIVAS) {
            throw new RegraDeNegocioException(
                    HttpStatus.TOO_MANY_REQUESTS, "codigo", "Muitas tentativas. Peça um novo código.");
        }

        if (Instant.now().isAfter(registro.getExpiraEm())) {
            throw new RegraDeNegocioException(
                    HttpStatus.BAD_REQUEST, "codigo", "Código expirado. Peça um novo código.");
        }

        if (!passwordEncoder.matches(codigoDigitado, registro.getCodigoHash())) {
            registro.setTentativas(registro.getTentativas() + 1);
            codigoRepository.save(registro);

            int restantes = MAX_TENTATIVAS - registro.getTentativas();
            throw new RegraDeNegocioException(
                    HttpStatus.BAD_REQUEST, "codigo",
                    "Código incorreto. Restam " + restantes + " tentativa(s).");
        }

        usuario.setEmailVerificado(true);
        usuarioRepository.save(usuario);
        codigoRepository.delete(registro);
    }


    /** Gera 5 dígitos, com zeros à esquerda se precisar (ex.: "00472"). */
    private String gerarCodigo() {
        return String.format("%05d", random.nextInt(100000));
    }
}