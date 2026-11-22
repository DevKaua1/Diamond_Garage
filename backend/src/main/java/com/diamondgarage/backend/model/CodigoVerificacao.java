package com.diamondgarage.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "codigos_verificacao")
public class CodigoVerificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    @Column(nullable = false)
    private String codigoHash;

    @Column(nullable = false)
    private Instant expiraEm;

    @Column(nullable = false)
    private int tentativas = 0;

    @Column(nullable = false)
    private int pedidos = 1;

    @Column(nullable = false)
    private Instant reenvioLiberadoEm;

    protected CodigoVerificacao() {
        // o JPA exige um construtor vazio
    }

    public CodigoVerificacao(Usuario usuario, String codigoHash, Instant expiraEm, Instant reenvioLiberadoEm) {
        this.usuario = usuario;
        this.codigoHash = codigoHash;
        this.expiraEm = expiraEm;
        this.reenvioLiberadoEm = reenvioLiberadoEm;
    }

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public String getCodigoHash() {
        return codigoHash;
    }

    public void setCodigoHash(String codigoHash) {
        this.codigoHash = codigoHash;
    }

    public Instant getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(Instant expiraEm) {
        this.expiraEm = expiraEm;
    }

    public int getTentativas() {
        return tentativas;
    }

    public void setTentativas(int tentativas) {
        this.tentativas = tentativas;
    }

    public int getPedidos() {
        return pedidos;
    }

    public void setPedidos(int pedidos) {
        this.pedidos = pedidos;
    }

    public Instant getReenvioLiberadoEm() {
        return reenvioLiberadoEm;
    }

    public void setReenvioLiberadoEm(Instant reenvioLiberadoEm) {
        this.reenvioLiberadoEm = reenvioLiberadoEm;
    }
}