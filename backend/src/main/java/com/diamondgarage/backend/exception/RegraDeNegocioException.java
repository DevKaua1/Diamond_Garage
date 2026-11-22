package com.diamondgarage.backend.exception;

import org.springframework.http.HttpStatus;

public class RegraDeNegocioException extends RuntimeException {

    private final HttpStatus status;
    private final String campo;

    public RegraDeNegocioException(HttpStatus status, String campo, String mensagem) {
        super(mensagem);
        this.status = status;
        this.campo = campo;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCampo() {
        return campo;
    }
}