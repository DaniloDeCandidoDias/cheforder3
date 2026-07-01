import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { itens: string[] } = {
    itens: []
}

const carrinhoSlice = createSlice({
        name:'carrinho',
        initialState,
        reducers:{
            addCarrinho : (state, action: PayloadAction<{item: string}>) => {
                state.itens.push(action.payload.item);
            },
            removeCarrinho : (state, action: PayloadAction<{item: string}>) => {
                state.itens = state.itens.filter((item) => item !== action.payload.item);
            }
        }
    });

    export const { addCarrinho, removeCarrinho } = carrinhoSlice.actions;
    export default carrinhoSlice.reducer;
