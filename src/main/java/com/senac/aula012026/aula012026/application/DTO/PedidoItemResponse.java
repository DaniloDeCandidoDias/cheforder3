package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.entities.ItemPedido;

import java.math.BigDecimal;

public record PedidoItemResponse(
        Long produtoId,
        String nomeProduto,
        Integer quantidade,
        BigDecimal valorUnitario,
        BigDecimal subtotal
) {
    public PedidoItemResponse(ItemPedido itemPedido){
        this(
                itemPedido.getProduto().getId(),
                itemPedido.getProduto().getNome(),
                itemPedido.getQuantidade(),
                itemPedido.getValorUnitario(),
                itemPedido.getSubtotal()
        );
    }
}
