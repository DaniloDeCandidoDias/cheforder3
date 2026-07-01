'use client'
import { buscarListaMesas } from "@/app/services/mesaService";
import { Mesa } from "@/app/types/mesas";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Mesas() {

    const [mesas, setMesas] = useState<Mesa[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await buscarListaMesas();
                setMesas(dados);

            } catch (error) {
                alert("Erro ao carregar mesas!")
                console.error(error)
            }
        }

        carregarDados();
    }, []);

    const mesasLivres = mesas.filter((mesa) => mesa.status === "LIVRE").length;
    const mesasOcupadas = mesas.filter((mesa) => mesa.status === "OCUPADA").length;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Mesas do restaurante
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Abra pedidos nas mesas livres, acompanhe contas em atendimento e finalize pelo mesmo lugar.
                    </p>
                </div>
                <Link
                    href="/mesas/novo"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <span className="text-xl">+</span> Nova Mesa
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Total de mesas</span>
                    <strong className="block text-2xl text-slate-900 mt-1">{mesas.length}</strong>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Livres</span>
                    <strong className="block text-2xl text-green-700 mt-1">{mesasLivres}</strong>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="text-sm font-medium text-slate-500">Ocupadas</span>
                    <strong className="block text-2xl text-orange-700 mt-1">{mesasOcupadas}</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {mesas.map((mesa) => (
                    <div key={mesa.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Mesa {mesa.numero}</h2>
                                <span className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mesa.status === 'LIVRE'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {mesa.status}
                                </span>
                            </div>
                            <Link
                                href={`/mesas/${mesa.id}/editar`}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Editar cadastro
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-100">
                            <Link
                                href={`/mesas/${mesa.id}/pedido`}
                                className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {mesa.status === "LIVRE" ? "Abrir pedido" : "Ver conta"}
                            </Link>
                        </div>
                    </div>
                ))}

                {mesas.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500 italic sm:col-span-2 lg:col-span-3">
                        Nenhuma mesa cadastrada!
                    </div>
                )}
            </div>
        </div>
    )
}
