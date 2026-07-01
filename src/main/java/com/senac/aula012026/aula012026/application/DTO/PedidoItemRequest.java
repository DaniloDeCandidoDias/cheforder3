package com.senac.aula012026.aula012026.application.DTO;

public record PedidoItemRequest(
        Long produtoId,
        Integer quantidade
) {
}
