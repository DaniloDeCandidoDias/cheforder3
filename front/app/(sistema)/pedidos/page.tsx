'use client'
import { buscarListaPedidos } from "@/app/services/pedidoService";
import { Pedido } from "@/app/types/pedidos";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Pedidos() {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await buscarListaPedidos();
                setPedidos(dados);

            } catch (error) {
                alert("Erro ao carregar pedidos!")
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

    const pedidosAbertos = pedidos.filter((pedido) => pedido.status === "ABERTO").length;
    const pedidosFechados = pedidos.filter((pedido) => pedido.status === "FECHADO").length;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Pedidos e contas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Consulte contas abertas e fechadas. Para iniciar um atendimento, escolha uma mesa.
                    </p>
                </div>
                <Link
                    href="/mesas"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    Ir para mesas
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Total de pedidos</span>
                    <strong className="block text-2xl text-slate-900 mt-1">{pedidos.length}</strong>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Abertos</span>
                    <strong className="block text-2xl text-orange-700 mt-1">{pedidosAbertos}</strong>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Fechados</span>
                    <strong className="block text-2xl text-green-700 mt-1">{pedidosFechados}</strong>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Codigo</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Mesa</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Produtos</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pedidos.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        <Link href={`/pedidos/${pedido.id}`} className="hover:text-blue-700">
                                            #{pedido.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        <Link href={`/pedidos/${pedido.id}`} className="hover:text-blue-700">
                                            Mesa {pedido.numeroMesa}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {pedido.itens?.reduce((total, item) => total + item.quantidade, 0) || pedido.produtos.length}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatarMoeda(pedido.total)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pedido.status === 'ABERTO'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {pedido.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {pedido.status === "ABERTO" ? (
                                            <Link
                                                href={`/mesas/${pedido.mesaId}/pedido`}
                                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                Continuar conta
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/pedidos/${pedido.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                Visualizar
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {pedidos.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                        Nenhum pedido encontrado!
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
