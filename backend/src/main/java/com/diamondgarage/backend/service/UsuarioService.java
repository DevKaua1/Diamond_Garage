package com.diamondgarage.backend.service;

import com.diamondgarage.backend.dto.CadastroRequest;
import com.diamondgarage.backend.exception.EmailJaCadastradoException;
import com.diamondgarage.backend.model.Usuario;
import com.diamondgarage.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrar(CadastroRequest dados) {
        String email = dados.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException();
        }

        String senhaHash = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados.nome().trim(), email, senhaHash);

        return usuarioRepository.save(usuario);
    }
}