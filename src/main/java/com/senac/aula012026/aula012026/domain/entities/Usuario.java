package com.senac.aula012026.aula012026.domain.entities;


import com.senac.aula012026.aula012026.application.DTO.UsuarioAdmRequest;
import com.senac.aula012026.aula012026.application.DTO.UsuarioRequest;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusUsuario;
import com.senac.aula012026.aula012026.domain.valueobjects.CPF;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Embedded
    private CPF cpf;

    private String email;

    private String senha;

    private String role;

    private EnumStatusUsuario status = EnumStatusUsuario.ATIVO;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "restaurante_id", referencedColumnName = "id")
    private Restaurante restaurante;


    public Usuario(UsuarioRequest usuario) {
        var usuarioLogado = getUsuarioLogado();
        this.email =usuario.email();
        this.nome = usuario.nome();
        if (usuario.cpf() != null && !usuario.cpf().isBlank()){
            this.cpf = new CPF(usuario.cpf());
        }
        this.senha = usuario.senha();
        this.role = "ROLE_USER";
        this.restaurante = usuarioLogado.getRestaurante();
    }

    public Usuario getUsuarioLogado(){
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Usuario(UsuarioAdmRequest usuario) {
        this.email =usuario.email();
        this.nome = usuario.nome();
        if (usuario.cpf() != null && !usuario.cpf().isBlank()){
            this.cpf = new CPF(usuario.cpf());
        }
        this.senha = usuario.senha();
        this.role = "ROLE_ADMIN";
    }

    public Usuario(UsuarioAdmRequest usuario, Restaurante restaurante) {
        this.email =usuario.email();
        this.nome = usuario.nome();
        if (usuario.cpf() != null && !usuario.cpf().isBlank()){
            this.cpf = new CPF(usuario.cpf());
        }
        this.senha = usuario.senha();
        this.role = "ROLE_ADMIN";
        this.restaurante = restaurante;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getPassword() {
       return this.senha;
    }

    @Override
    public String getUsername() {
        return  this.email;
    }
}
