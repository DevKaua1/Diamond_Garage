package com.diamondgarage.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CadastroRequest(

        @NotBlank(message = "Digite seu nome completo.")
        @Size(min = 3, message = "Digite seu nome completo.")
        String nome,

        @NotBlank(message = "Digite seu e-mail.")
        @Email(message = "Digite um e-mail válido.")
        String email,

        @NotBlank(message = "Digite sua senha.")
        @Pattern(
                regexp = "^(?=.*[A-Za-zÀ-ÿ])(?=.*[0-9]).{8,}$",
                message = "A senha precisa ter 8 caracteres, com letra e número."
        )
        String senha
) {}