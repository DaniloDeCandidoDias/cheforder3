'use client'
import { atualizarMesa, salvarMesa } from "@/app/services/mesaService";
import { Mesa, MesaFormProps } from "@/app/types/mesas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function MesaForm({ mesaExistente }: MesaFormProps) {

    const [mesa, setMesa] = useState<Mesa>(
        mesaExistente || new Mesa(null, 1, "LIVRE")
    );

    const router = useRouter();

    const handleChange = (campo: 'numero' | 'status', valor: string) => {
        setMesa(prev =>
            new Mesa(
                prev.id,
                campo === 'numero' ? Number(valor) : prev.numero,
                campo === 'status' ? valor : prev.status,
            )
        )
    }

    const handleSalvar = async () => {

        if (mesaExistente) {
            await atualizarMesa(mesa);
            alert("Mesa atualizada com sucesso!")
        } else {
            const dadosResult = await salvarMesa(mesa)
            alert("Mesa salva com sucesso! Codigo:" + dadosResult)
        }

        router.push("/mesas")
    }

    return (
        <form action={handleSalvar} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Numero da mesa
                    </label>
                    <input
                        type="number"
                        min="1"
                        required
                        value={mesa.numero}
                        onChange={(e) => handleChange('numero', e.target.value)}
                        placeholder="1"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Status
                    </label>
                    <select
                        required
                        value={mesa.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-white"
                    >
                        <option value="LIVRE">Livre</option>
                        <option value="OCUPADA">Ocupada</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
                    <Link
                        href="/mesas"
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
