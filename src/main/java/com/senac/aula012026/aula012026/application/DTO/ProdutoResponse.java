package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.entities.Produto;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String nome,
        BigDecimal preco
) {
    public ProdutoResponse(Produto produto){
        this(
                produto.getId(),
                produto.getNome(),
                produto.getPreco()
        );
    }
}
