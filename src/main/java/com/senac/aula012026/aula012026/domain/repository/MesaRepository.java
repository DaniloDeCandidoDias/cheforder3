package com.senac.aula012026.aula012026.domain.repository;

import com.senac.aula012026.aula012026.domain.entities.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa,Long> {

     Optional<Mesa> findByIdAndRestaurante_Id(Long id, Long restauranteId);

     List<Mesa> getMesasByRestaurante_Id(Long restauranteId);
}
