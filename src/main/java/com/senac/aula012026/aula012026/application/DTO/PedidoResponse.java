package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.entities.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String status,
        Long mesaId,
        Integer numeroMesa,
        List<ProdutoResponse> produtos,
        List<PedidoItemResponse> itens,
        LocalDateTime dataHora,
        BigDecimal total
) {
    public PedidoResponse(Pedido pedido){
        this(
                pedido.getId(),
                pedido.getStatus().toString(),
                pedido.getMesa().getId(),
                pedido.getMesa().getNumero(),
                pedido.getItens() == null
                        ? List.of()
                        : pedido.getItens()
                        .stream()
                        .map(item -> new ProdutoResponse(item.getProduto()))
                        .toList(),
                pedido.getItens() == null
                        ? List.of()
                        : pedido.getItens()
                        .stream()
                        .map(PedidoItemResponse::new)
                        .toList(),
                pedido.getDataHora(),
                pedido.getValorTotal() == null
                        ? BigDecimal.ZERO
                        : pedido.getValorTotal()
        );
    }
}
