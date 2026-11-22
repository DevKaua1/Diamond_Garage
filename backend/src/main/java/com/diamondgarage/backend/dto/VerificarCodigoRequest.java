package com.diamondgarage.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerificarCodigoRequest(

        @NotBlank(message = "Informe o e-mail.")
        @Email(message = "Digite um e-mail válido.")
        String email,

        @NotBlank(message = "Digite os 5 números do código.")
        @Pattern(regexp = "^[0-9]{5}$", message = "Digite os 5 números do código.")
        String codigo
) {}