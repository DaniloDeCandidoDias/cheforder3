package com.senac.aula012026.aula012026.domain.repository;

import com.senac.aula012026.aula012026.domain.entities.Pedido;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido,Long> {

     Optional<Pedido> findByIdAndRestaurante_Id(Long id, Long restauranteId);

     Optional<Pedido> findFirstByMesa_IdAndRestaurante_IdAndStatus(Long mesaId, Long restauranteId, EnumStatusPedido status);

     List<Pedido> getPedidosByRestaurante_Id(Long restauranteId);
}
