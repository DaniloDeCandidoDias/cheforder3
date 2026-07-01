'use client'
import { Mesa } from "../types/mesas";
import api from "./api";

export async function buscarListaMesas(): Promise<Mesa[]> {
    const dados = await api.get<Mesa[]>('/mesas');

    if (dados.status == 200) {
        return dados.data;
    }
    return [];
}

export async function atualizarMesa(mesaExistente : Mesa): Promise<number> {
    const dadosResult = await api
            .put<number>('/mesas/'+mesaExistente.id, mesaExistente);

    return dadosResult.data;
}

export async function salvarMesa(mesa:Mesa) : Promise<number>{

       const dadosResult = await api.post<number>('/mesas', mesa);

        return dadosResult.data;
}

export async function buscarMesaPorId(codigo:number): Promise<Mesa> {
    return (await api.get<Mesa>('/mesas/'+codigo)).data
}
