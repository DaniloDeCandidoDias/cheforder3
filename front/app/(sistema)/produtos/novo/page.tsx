import Link from "next/link";
import ProdutoForm from "../componentes/ProdutoForm";

export default function cadastrarProduto() {
    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-3 mb-8">
                    <Link
                        href="/produtos"
                        className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">&lt;-</span>
                        Voltar para cardapio
                    </Link>

                    <div className="space-y-1 border-l-4 border-emerald-500 pl-4">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Novo Produto
                        </h1>
                        <p className="text-sm text-slate-500">
                            Preencha os dados para incluir um item no cardapio.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <ProdutoForm />
                </div>
            </div>
        </div>
    );
}
