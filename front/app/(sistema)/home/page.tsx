'use client'
import { buscarListaMesas } from "@/app/services/mesaService";
import { buscarListaPedidos } from "@/app/services/pedidoService";
import { buscarListaProdutos } from "@/app/services/produtoService";
import { buscarListaUsuarios } from "@/app/services/usuarioService";
import { Mesa } from "@/app/types/mesas";
import { Pedido } from "@/app/types/pedidos";
import { Produto } from "@/app/types/produtos";
import { Usuario } from "@/app/types/usuarios";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home(){

    const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [funcionarios, setFuncionarios] = useState<Usuario[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const mesasResult = await buscarListaMesas();
                const produtosResult = await buscarListaProdutos();
                const pedidosResult = await buscarListaPedidos();
                const funcionariosResult = usuarioLogado?.role === "ROLE_ADMIN"
                    ? await buscarListaUsuarios()
                    : [];

                setMesas(mesasResult);
                setProdutos(produtosResult);
                setPedidos(pedidosResult);
                setFuncionarios(funcionariosResult);
            } catch (error) {
                alert("Erro ao carregar dashboard!")
                console.error(error)
            }
        }

        carregarDados();
    }, [usuarioLogado?.role]);

    const pedidosAbertos = pedidos.filter((pedido) => pedido.status === "ABERTO");
    const mesasOcupadas = mesas.filter((mesa) => mesa.status === "OCUPADA").length;
    const faturamentoAberto = pedidosAbertos.reduce((total, pedido) => total + Number(pedido.total || 0), 0);
    const faturamentoFinalizado = pedidos
        .filter((pedido) => pedido.status === "FECHADO")
        .reduce((total, pedido) => total + Number(pedido.total || 0), 0);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    }

    return(
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard ChefOrder
                </h1>
                <p className="text-sm text-slate-500">
                    Acompanhe mesas, cardapio, funcionarios e pedidos do restaurante.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <span className="text-sm font-medium text-slate-500">Mesas ocupadas</span>
                    <strong className="block text-3xl text-slate-900 mt-2">{mesasOcupadas}</strong>
                    <p className="text-xs text-slate-400 mt-1">{mesas.length} mesas cadastradas</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <span className="text-sm font-medium text-slate-500">Pedidos abertos</span>
                    <strong className="block text-3xl text-slate-900 mt-2">{pedidosAbertos.length}</strong>
                    <p className="text-xs text-slate-400 mt-1">Contas em atendimento</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <span className="text-sm font-medium text-slate-500">Cardapio</span>
                    <strong className="block text-3xl text-slate-900 mt-2">{produtos.length}</strong>
                    <p className="text-xs text-slate-400 mt-1">Produtos cadastrados</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <span className="text-sm font-medium text-slate-500">Total aberto</span>
                    <strong className="block text-3xl text-slate-900 mt-2">{formatarMoeda(faturamentoAberto)}</strong>
                    <p className="text-xs text-slate-400 mt-1">{funcionarios.length} funcionarios ativos no sistema</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <span className="text-sm font-medium text-slate-500">Total arrecadado</span>
                    <strong className="block text-3xl text-slate-900 mt-2">{formatarMoeda(faturamentoFinalizado)}</strong>
                    <p className="text-xs text-slate-400 mt-1">Pedidos finalizados</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Visao geral de mesas</h2>
                        <Link href="/mesas" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Ver mesas
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {mesas.slice(0, 9).map((mesa) => (
                            <div key={mesa.id} className="border border-slate-200 rounded-lg p-3">
                                <span className="text-sm font-semibold text-slate-800">Mesa {mesa.numero}</span>
                                <span className={`block text-xs font-bold mt-1 ${mesa.status === "LIVRE" ? "text-green-600" : "text-orange-600"}`}>
                                    {mesa.status}
                                </span>
                            </div>
                        ))}
                        {mesas.length === 0 && (
                            <p className="text-sm text-slate-500 col-span-full">Nenhuma mesa cadastrada.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Pedidos recentes</h2>
                        <Link href="/pedidos" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Ver pedidos
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pedidos.slice(0, 5).map((pedido) => (
                            <div key={pedido.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Mesa {pedido.numeroMesa}</p>
                                    <p className="text-xs text-slate-500">
                                        {pedido.itens?.reduce((total, item) => total + item.quantidade, 0) || pedido.produtos.length} produtos
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-800">{formatarMoeda(Number(pedido.total || 0))}</p>
                                    <p className="text-xs text-slate-500">{pedido.status}</p>
                                </div>
                            </div>
                        ))}
                        {pedidos.length === 0 && (
                            <p className="text-sm text-slate-500">Nenhum pedido lancado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
