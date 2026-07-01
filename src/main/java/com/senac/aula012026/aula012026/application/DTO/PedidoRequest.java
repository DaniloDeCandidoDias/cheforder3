package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.enuns.EnumStatusPedido;

import java.util.List;

public record PedidoRequest(
        Long mesaId,
        List<Long> produtosIds,
        List<PedidoItemRequest> itens,
        EnumStatusPedido status
) {
}
