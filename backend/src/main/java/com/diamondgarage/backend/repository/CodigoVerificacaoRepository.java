package com.diamondgarage.backend.repository;

import com.diamondgarage.backend.model.CodigoVerificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodigoVerificacaoRepository extends JpaRepository<CodigoVerificacao, Long> {

    Optional<CodigoVerificacao> findByUsuarioEmail(String email);
}