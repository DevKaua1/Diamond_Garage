package com.diamondgarage.backend.controller;

import com.diamondgarage.backend.dto.CadastroRequest;
import com.diamondgarage.backend.dto.CadastroResponse;
import com.diamondgarage.backend.model.Usuario;
import com.diamondgarage.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CadastroController {

    private final UsuarioService usuarioService;

    public CadastroController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<CadastroResponse> cadastrar(@Valid @RequestBody CadastroRequest dados) {
        Usuario usuario = usuarioService.cadastrar(dados);

        CadastroResponse resposta = new CadastroResponse(
                usuario.getId(), usuario.getNome(), usuario.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}