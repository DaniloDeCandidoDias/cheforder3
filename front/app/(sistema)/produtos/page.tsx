'use client'
import { buscarListaProdutos } from "@/app/services/produtoService";
import { Produto } from "@/app/types/produtos";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Produtos() {

    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await buscarListaProdutos();
                setProdutos(dados);

            } catch (error) {
                alert("Erro ao carregar produtos!")
                console.error(error)
            }
        }

        carregarDados();
    }, []);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor || 0));
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Cadastro de Produtos
                </h1>
                <Link
                    href="/produtos/novo"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <span className="text-xl">+</span> Novo Produto
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Codigo</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Produto</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Preco</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {produtos.map((produto) => (
                                <tr key={produto.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        #{produto.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {produto.nome}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatarMoeda(produto.preco)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <Link
                                            href={`/produtos/${produto.id}/editar`}
                                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {produtos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                        Nenhum produto cadastrado!
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
