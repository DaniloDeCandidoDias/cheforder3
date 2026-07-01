package com.senac.aula012026.aula012026.application.DTO;

import java.math.BigDecimal;

public record ProdutoRequest(
        String nome,
        BigDecimal preco
) {
}
