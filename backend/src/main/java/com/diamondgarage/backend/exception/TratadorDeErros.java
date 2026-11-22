package com.diamondgarage.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> dadosInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();

        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            String campo = erro.getField();
            boolean ehNotBlank = "NotBlank".equals(erro.getCode());

            if (ehNotBlank || !erros.containsKey(campo)) {
                erros.put(campo, erro.getDefaultMessage());
            }
        }

        return ResponseEntity.badRequest().body(erros);
    }

    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<Map<String, String>> emailDuplicado(EmailJaCadastradoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("email", ex.getMessage()));
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<Map<String, String>> regraDeNegocio(RegraDeNegocioException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Map.of(ex.getCampo(), ex.getMessage()));
    }
}