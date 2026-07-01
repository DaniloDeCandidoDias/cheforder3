package com.senac.aula012026.aula012026.domain.entities;

import com.senac.aula012026.aula012026.application.DTO.UsuarioAdmRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeFantasia;

    private String cep;

    private String logradouro;

    private String numero;

    private String bairro;

    private String cidade;

    private String estado;

    private String complemento;

    @OneToMany(mappedBy = "restaurante")
    private List<Usuario> usuarios;

    @OneToMany(mappedBy = "restaurante")
    private List<Mesa> mesas;

    @OneToMany(mappedBy = "restaurante")
    private List<Produto> produtos;

    @OneToMany(mappedBy = "restaurante")
    private List<Pedido> pedidos;

    public Restaurante(UsuarioAdmRequest usuario){
        this.nomeFantasia = usuario.nome();
        this.cep = usuario.cep();
        this.logradouro = usuario.logradouro();
        this.numero = usuario.numero();
        this.bairro = usuario.bairro();
        this.cidade = usuario.cidade();
        this.estado = usuario.estado();
        this.complemento = usuario.complemento();
    }
}
