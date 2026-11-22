package com.diamondgarage.backend.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailConsole implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailConsole.class);

    @Override
    public void enviarCodigo(String destinatario, String codigo) {
        log.info("[MODO DEV] Código de verificação para {}: {}", destinatario, codigo);
    }
}