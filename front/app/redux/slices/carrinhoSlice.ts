import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Mesa } from "@/app/types/mesas";
import { Pedido } from "@/app/types/pedidos";

interface CarrinhoState {
    mesa: Mesa | null;
    pedido: Pedido | null;
    quantidades: Record<number, number>;
    salvando: boolean;
}

const initialState: CarrinhoState = {
    mesa: null,
    pedido: null,
    quantidades: {},
    salvando: false
}

const carrinhoSlice = createSlice({
        name:'carrinho',
        initialState,
        reducers:{
            setCarrinhoPedido : (state, action: PayloadAction<{mesa: Mesa, pedido: Pedido | null, quantidades: Record<number, number>}>) => {
                state.mesa = action.payload.mesa;
                state.pedido = action.payload.pedido;
                state.quantidades = action.payload.quantidades;
            },
            alterarQuantidadeCarrinho : (state, action: PayloadAction<{produtoId: number, quantidade: number}>) => {
                if(action.payload.quantidade <= 0){
                    delete state.quantidades[action.payload.produtoId];
                    return;
                }

                state.quantidades[action.payload.produtoId] = action.payload.quantidade;
            },
            setSalvandoCarrinho : (state, action: PayloadAction<{salvando: boolean}>) => {
                state.salvando = action.payload.salvando;
            },
            limparCarrinho : (state) => {
                state.mesa = null;
                state.pedido = null;
                state.quantidades = {};
                state.salvando = false;
            }
        }
    });

    export const { setCarrinhoPedido, alterarQuantidadeCarrinho, setSalvandoCarrinho, limparCarrinho } = carrinhoSlice.actions;
    export default carrinhoSlice.reducer;
