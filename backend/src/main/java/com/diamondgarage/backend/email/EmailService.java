package com.diamondgarage.backend.email;

public interface EmailService {

    void enviarCodigo(String destinatario, String codigo);
}