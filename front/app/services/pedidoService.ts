'use client'
import { Pedido, PedidoRequest } from "../types/pedidos";
import api from "./api";

export async function buscarListaPedidos(): Promise<Pedido[]> {
    const dados = await api.get<Pedido[]>('/pedidos');

    if (dados.status == 200) {
        return dados.data;
    }
    return [];
}

export async function buscarPedidoPorId(codigo:number): Promise<Pedido> {
    return (await api.get<Pedido>('/pedidos/'+codigo)).data
}

export async function buscarPedidoAbertoPorMesa(mesaId:number): Promise<Pedido | null> {
    const dados = await api.get<Pedido | null>('/pedidos/mesa/'+mesaId+'/aberto');
    return dados.data || null;
}

export async function lancarProdutosPedido(pedido:PedidoRequest) : Promise<number>{

       const dadosResult = await api.post<number>('/pedidos/lancar', pedido);

        return dadosResult.data;
}

export async function fecharPedido(codigo:number): Promise<void> {
    await api.put('/pedidos/'+codigo+'/fechar');
}
