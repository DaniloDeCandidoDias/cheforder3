package com.senac.aula012026.aula012026.domain.repository;

import com.senac.aula012026.aula012026.domain.enuns.EnumStatusUsuario;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

     Optional<Usuario> findByIdAndRestaurante_Id(Long id, Long restauranteId);

     List<Usuario> getUsuariosByRestaurante_Id(Long restaurante);

     Optional<Usuario> findFirstByEmail(String email);

     boolean existsUsuarioByEmailAndSenha(String email, String senha);

     boolean existsUsuarioByEmailAndSenhaAndStatus(String email, String senha, EnumStatusUsuario status);
}
