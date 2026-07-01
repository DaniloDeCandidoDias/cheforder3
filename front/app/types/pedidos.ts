import { Produto } from "./produtos";

export interface PedidoItem {
    produtoId: number;
    nomeProduto: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
}

export interface PedidoItemRequest {
    produtoId: number;
    quantidade: number;
}

export interface Pedido {
    id: number;
    status: string;
    mesaId: number;
    numeroMesa: number;
    produtos: Produto[];
    itens: PedidoItem[];
    dataHora: string;
    total: number;
}

export interface PedidoRequest {
    mesaId: number;
    produtosIds?: number[];
    itens?: PedidoItemRequest[];
    status?: string;
}
