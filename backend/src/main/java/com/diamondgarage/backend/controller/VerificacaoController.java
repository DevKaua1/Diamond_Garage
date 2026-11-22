package com.diamondgarage.backend.controller;

import com.diamondgarage.backend.dto.VerificarCodigoRequest;
import com.diamondgarage.backend.service.CodigoVerificacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class VerificacaoController {

    private final CodigoVerificacaoService codigoService;

    public VerificacaoController(CodigoVerificacaoService codigoService) {
        this.codigoService = codigoService;
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<Map<String, String>> verificar(@Valid @RequestBody VerificarCodigoRequest dados) {
        codigoService.verificar(dados.email(), dados.codigo());
        return ResponseEntity.ok(Map.of("mensagem", "E-mail verificado."));
    }
}