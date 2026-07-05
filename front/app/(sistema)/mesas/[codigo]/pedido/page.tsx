'use client'
import { buscarMesaPorId } from "@/app/services/mesaService";
import { buscarPedidoAbertoPorMesa, fecharPedido, lancarProdutosPedido } from "@/app/services/pedidoService";
import { buscarListaProdutos } from "@/app/services/produtoService";
import { Pedido } from "@/app/types/pedidos";
import { Produto } from "@/app/types/produtos";
import { RootState } from "@/app/redux/store";
import { alterarQuantidadeCarrinho, limparCarrinho, setCarrinhoPedido, setSalvandoCarrinho } from "@/app/redux/slices/carrinhoSlice";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const montarQuantidadesPedido = (pedidoAberto: Pedido | null) => {
    const novasQuantidades: Record<number, number> = {};

    if(pedidoAberto?.itens?.length){
        pedidoAberto.itens.forEach((item) => {
            novasQuantidades[item.produtoId] = item.quantidade;
        });

        return novasQuantidades;
    }

    pedidoAberto?.produtos?.forEach((produto) => {
        if(produto.id !== null){
            novasQuantidades[produto.id] = (novasQuantidades[produto.id] || 0) + 1;
        }
    });

    return novasQuantidades;
}

export default function LancarPedidoMesa(){

    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch();
    const codigo = Number(params.codigo);

    const [produtos,setProdutos] = useState<Produto[]>([]);
    const mesa = useSelector((state: RootState) => state.carrinho.mesa);
    const pedido = useSelector((state: RootState) => state.carrinho.pedido);
    const quantidades = useSelector((state: RootState) => state.carrinho.quantidades);
    const salvando = useSelector((state: RootState) => state.carrinho.salvando);

    const carregarDados = useCallback(async ()=>{
        try {
            const mesaResult = await buscarMesaPorId(codigo)
            const produtosResult = await buscarListaProdutos()
            const pedidoAberto = await buscarPedidoAbertoPorMesa(codigo)

            if (!mesaResult) {
                router.push("/mesas")
                return;
            }

            setProdutos(produtosResult)
            dispatch(setCarrinhoPedido({
                mesa: mesaResult,
                pedido: pedidoAberto,
                quantidades: montarQuantidadesPedido(pedidoAberto)
            }))
        } catch (error) {
            alert("Erro ao carregar dados da mesa!")
            console.error(error)
        }
    }, [codigo, dispatch, router]);

    useEffect(()=>
    {
        carregarDados();

        return () => {
            dispatch(limparCarrinho())
        }
    },[carregarDados, dispatch]);

    const alterarQuantidade = (produtoId: number, quantidade: number) => {
        dispatch(alterarQuantidadeCarrinho({produtoId, quantidade}))
    }

    const handleSalvar = async () => {
        const itens = montarItensRequest();

        if(itens.length === 0){
            alert("Selecione pelo menos um produto para abrir o pedido.")
            return;
        }

        try {
            dispatch(setSalvandoCarrinho({salvando: true}));
            await lancarProdutosPedido({
                mesaId: codigo,
                itens,
                status: "ABERTO"
            })

            alert("Produtos lancados com sucesso!")
            await carregarDados();
        } catch (error) {
            alert("Erro ao lancar produtos!")
            console.error(error)
        } finally {
            dispatch(setSalvandoCarrinho({salvando: false}));
        }
    }

    const handleFecharConta = async () => {
        const itens = montarItensRequest();

        if(!pedido && itens.length === 0){
            alert("Selecione pelo menos um produto antes de fechar a conta.")
            return;
        }

        const confirmar = window.confirm("Fechar a conta desta mesa?");
        if(!confirmar){
            return;
        }

        try {
            dispatch(setSalvandoCarrinho({salvando: true}));
            const pedidoId = await lancarProdutosPedido({
                mesaId: codigo,
                itens,
                status: "ABERTO"
            })

            await fecharPedido(pedidoId)
            alert("Conta fechada com sucesso!")
            dispatch(limparCarrinho())
            router.push("/mesas")
        } catch (error) {
            alert("Erro ao fechar conta!")
            console.error(error)
        } finally {
            dispatch(setSalvandoCarrinho({salvando: false}));
        }
    }

    const montarItensRequest = () => {
        return Object.entries(quantidades)
            .filter(([, quantidade]) => quantidade > 0)
            .map(([produtoId, quantidade]) => ({
                produtoId: Number(produtoId),
                quantidade
            }));
    }

    const total = produtos
        .filter((produto) => produto.id !== null && quantidades[produto.id])
        .reduce((valor, produto) => valor + Number(produto.preco || 0) * quantidades[produto.id as number], 0);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    }

    const totalItens = Object.values(quantidades).reduce((totalItens, quantidade) => totalItens + quantidade, 0);
    const quantidadesPedidoSalvo = montarQuantidadesPedido(pedido);
    const ordenarQuantidades = (itens: Record<number, number>) => Object.entries(itens)
        .sort(([produtoA], [produtoB]) => Number(produtoA) - Number(produtoB))
        .map(([produtoId, quantidade]) => `${produtoId}:${quantidade}`)
        .join(",");
    const possuiAlteracoes = ordenarQuantidades(quantidadesPedidoSalvo) !== ordenarQuantidades(quantidades);

    if(!mesa) return(<div className="p-8">Carregando dados...</div>)

    return(
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-3 mb-8">
                    <Link
                        href="/mesas"
                        className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">&lt;-</span>
                        Voltar para mesas
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div className="space-y-1 border-l-4 border-blue-500 pl-4">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Mesa {mesa.numero}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <span>Pedido {pedido ? "aberto" : "ainda nao aberto"}</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mesa.status === "LIVRE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}>
                                    {mesa.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-right">
                            <span className="text-xs font-semibold uppercase text-slate-500">Total da conta</span>
                            <strong className="block text-2xl text-slate-900">{formatarMoeda(total)}</strong>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Cardapio da mesa</h2>
                            <p className="text-sm text-slate-500">
                                Informe a quantidade de cada item consumido.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {produtos.map((produto) => (
                                <label
                                    key={produto.id}
                                    className={`flex items-center justify-between gap-4 border rounded-xl p-4 transition-colors ${produto.id !== null && quantidades[produto.id]
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{produto.nome}</p>
                                        <p className="text-sm text-slate-500">{formatarMoeda(produto.preco)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={produto.id === null}
                                            onClick={() => produto.id !== null && alterarQuantidade(produto.id, (quantidades[produto.id] || 0) - 1)}
                                            className="h-8 w-8 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-40"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-800">
                                            {produto.id === null ? 0 : quantidades[produto.id] || 0}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={produto.id === null}
                                            onClick={() => produto.id !== null && alterarQuantidade(produto.id, (quantidades[produto.id] || 0) + 1)}
                                            className="h-8 w-8 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>
                                </label>
                            ))}

                            {produtos.length === 0 && (
                                <p className="text-sm text-slate-500">Cadastre produtos antes de lancar pedidos.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Conta da mesa</h2>
                                <p className="text-sm text-slate-500">
                                    {totalItens} itens selecionados
                                </p>
                            </div>
                            {pedido && possuiAlteracoes && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-yellow-100 text-yellow-700">
                                    Nao salvo
                                </span>
                            )}
                        </div>
                        <div className="space-y-3 mb-6">
                            {produtos
                                .filter((produto) => produto.id !== null && quantidades[produto.id])
                                .map((produto) => (
                                    <div key={produto.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <span className="text-sm text-slate-700">
                                            {quantidades[produto.id as number]}x {produto.nome}
                                        </span>
                                        <strong className="text-sm text-slate-900">
                                            {formatarMoeda(Number(produto.preco || 0) * quantidades[produto.id as number])}
                                        </strong>
                                    </div>
                                ))}

                            {totalItens === 0 && (
                                <p className="text-sm text-slate-500">Nenhum produto selecionado.</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSalvar}
                            disabled={salvando || totalItens === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mb-3"
                        >
                            {pedido ? "Salvar alteracoes" : "Abrir pedido"}
                        </button>

                        <button
                            type="button"
                            disabled={salvando || (!pedido && totalItens === 0)}
                            onClick={handleFecharConta}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                        >
                            Salvar e fechar conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
