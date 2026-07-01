package com.senac.aula012026.aula012026.domain.repository;

import com.senac.aula012026.aula012026.domain.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto,Long> {

     Optional<Produto> findByIdAndRestaurante_Id(Long id, Long restauranteId);

     List<Produto> getProdutosByRestaurante_Id(Long restauranteId);

     List<Produto> findByIdInAndRestaurante_Id(List<Long> ids, Long restauranteId);
}
