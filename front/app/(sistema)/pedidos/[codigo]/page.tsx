'use client'
import { buscarPedidoPorId } from "@/app/services/pedidoService";
import { Pedido } from "@/app/types/pedidos";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VisualizarPedido(){

    const params = useParams();
    const codigo = Number(params.codigo);

    const [pedido, setPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await buscarPedidoPorId(codigo);
                setPedido(dados);
            } catch (error) {
                alert("Erro ao carregar pedido!")
                console.error(error)
            }
        }

        carregarDados();
    }, [codigo]);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor || 0));
    }

    const formatarData = (dataHora?: string) => {
        if(!dataHora){
            return "Data nao informada";
        }

        return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
        }).format(new Date(dataHora));
    }

    if(!pedido){
        return <div className="p-8">Carregando pedido...</div>
    }

    return(
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-3 mb-8">
                <Link
                    href="/pedidos"
                    className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <span className="mr-2 transition-transform group-hover:-translate-x-1">&lt;-</span>
                    Voltar para pedidos
                </Link>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div className="space-y-1 border-l-4 border-blue-500 pl-4">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Pedido #{pedido.id}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Mesa {pedido.numeroMesa}</span>
                            <span>{formatarData(pedido.dataHora)}</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pedido.status === "ABERTO"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                                {pedido.status}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-right">
                        <span className="text-xs font-semibold uppercase text-slate-500">Valor total</span>
                        <strong className="block text-2xl text-slate-900">{formatarMoeda(pedido.total)}</strong>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Produto</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quantidade</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Valor unitario</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pedido.itens.map((item) => (
                                <tr key={item.produtoId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {item.nomeProduto}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {item.quantidade}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatarMoeda(item.valorUnitario)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                                        {formatarMoeda(item.subtotal)}
                                    </td>
                                </tr>
                            ))}

                            {pedido.itens.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                        Nenhum produto encontrado neste pedido.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-50 border-t border-slate-200">
                                <td colSpan={3} className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                                    Total
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                                    {formatarMoeda(pedido.total)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}
