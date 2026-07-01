'use client'
import { Usuario } from "../types/usuarios";
import api from "./api";



export async function buscarListaUsuarios(): Promise<Usuario[]> {
    const dados = await api.get<Usuario[]>('/usuarios');

    if (dados.status == 200) {
        return dados.data;
    }
    return [];
}
export async function atualizar(usuarioExistente : Usuario): Promise<number> {
    const dadosResult = await api
            .put<number>('/usuarios/'+usuarioExistente.id, usuarioExistente);
          
    return dadosResult.data;
    
}

export async function salvar(usuario:Usuario) : Promise<number>{

       const dadosResult = await api.post<number>('/usuarios', usuario);

        return dadosResult.data;
}
export async function buscarPorId(codigo:number): Promise<Usuario> {
    return (await api.get<Usuario>('/usuarios/'+codigo)).data
}

export async function alterarStatusUsuario(usuario: Usuario): Promise<void> {

    const novoStatus = usuario.status === "ATIVO"
        ? { status: "INATIVO" }
        : { status: "ATIVO" };

    const dadosResult = await api
        .put<number>('/usuarios/' + usuario.id + '/AlterarStatus', novoStatus);

    if (dadosResult.status !== 200) {
        alert("Erro ao atualizar Status!")
    }
}

export async function  buscarUsuarioLogado() : Promise<Usuario> {
     return (await api.get<Usuario>('/usuarios/usuariologado')).data;
}

