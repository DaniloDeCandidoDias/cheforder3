'use client'
import { alterarStatusUsuario, buscarListaUsuarios } from "@/app/services/usuarioService";
import { RootState } from "@/app/redux/store";
import { Usuario } from "@/app/types/usuarios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Usuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
    const podeAlterarStatus = usuarioLogado?.role === "ROLE_ADMIN";

    const carregarDados = useCallback(async () => {
        try {
            const dados = await buscarListaUsuarios();
            setUsuarios(dados);

        } catch (error) {
            alert("Erro ao carregar funcionarios!")
            console.error(error)
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => carregarDados(), 0);
        return () => window.clearTimeout(timer);
    }, [carregarDados]);

    const handlerAlerarStatus = async (usuario: Usuario) => {
        try {
           
            await alterarStatusUsuario(usuario)
            carregarDados();

            alert("Status alterado com sucesso! Codigo:" + usuario.id)

        } catch {
            alert("Erro ao alterar status do funcionario!")
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Cadastro de Funcionarios
                </h1>
                <Link
                    href="/usuarios/novo"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <span className="text-xl">+</span> Novo Funcionario
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Codigo</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nome</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        #{usuario.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {usuario.nome}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {usuario.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${usuario.status ==='INATIVO'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {usuario.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right space-x-3">
                                        <Link
                                            href={`/usuarios/${usuario.id}/editar`}
                                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        {podeAlterarStatus && (
                                            <button
                                                onClick={() => handlerAlerarStatus(usuario)}
                                                className={`font-medium transition-colors ${usuario.status ==='INATIVO'
                                                        ? 'text-green-600 hover:text-green-800'
                                                        : 'text-orange-600 hover:text-orange-800'
                                                    }`}
                                            >
                                                {usuario.status === 'INATIVO' ? 'Ativar' : 'Inativar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                        Nenhum funcionario encontrado!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
