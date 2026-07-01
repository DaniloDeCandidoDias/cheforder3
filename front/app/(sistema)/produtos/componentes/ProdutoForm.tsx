'use client'
import { atualizarProduto, salvarProduto } from "@/app/services/produtoService";
import { Produto, ProdutoFormProps } from "@/app/types/produtos";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function ProdutoForm({ produtoExistente }: ProdutoFormProps) {

    const [produto, setProduto] = useState<Produto>(
        produtoExistente || new Produto(null, '', 0)
    );

    const router = useRouter();

    const handleChange = (campo: 'nome' | 'preco', valor: string) => {
        setProduto(prev =>
            new Produto(
                prev.id,
                campo === 'nome' ? valor : prev.nome,
                campo === 'preco' ? Number(valor) : prev.preco,
            )
        )
    }

    const handleSalvar = async () => {

        if (produtoExistente) {
            await atualizarProduto(produto);
            alert("Produto atualizado com sucesso!")
        } else {
            const dadosResult = await salvarProduto(produto)
            alert("Produto salvo com sucesso! Codigo:" + dadosResult)
        }

        router.push("/produtos")
    }

    return (
        <form action={handleSalvar} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Nome do produto
                    </label>
                    <input
                        type="text"
                        required
                        value={produto.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        placeholder="Prato executivo"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Preco
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={produto.preco}
                        onChange={(e) => handleChange('preco', e.target.value)}
                        placeholder="29.90"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
                    <Link
                        href="/produtos"
                        className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        CANCELAR
                    </Link>
                    <button
                        type="submit"
                        className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        SALVAR
                    </button>
                </div>
            </div>
        </form>
    )
}
