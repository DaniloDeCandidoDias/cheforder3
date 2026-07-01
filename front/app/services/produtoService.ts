'use client'
import { Produto } from "../types/produtos";
import api from "./api";

export async function buscarListaProdutos(): Promise<Produto[]> {
    const dados = await api.get<Produto[]>('/produtos');

    if (dados.status == 200) {
        return dados.data;
    }
    return [];
}

export async function atualizarProduto(produtoExistente : Produto): Promise<number> {
    const dadosResult = await api
            .put<number>('/produtos/'+produtoExistente.id, produtoExistente);

    return dadosResult.data;
}

export async function salvarProduto(produto:Produto) : Promise<number>{

       const dadosResult = await api.post<number>('/produtos', produto);

        return dadosResult.data;
}

export async function buscarProdutoPorId(codigo:number): Promise<Produto> {
    return (await api.get<Produto>('/produtos/'+codigo)).data
}
