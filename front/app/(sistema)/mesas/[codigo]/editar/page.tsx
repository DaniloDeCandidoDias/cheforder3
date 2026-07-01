'use client'
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MesaForm from "../../componentes/MesaForm";
import { Mesa } from "@/app/types/mesas";
import { buscarMesaPorId } from "@/app/services/mesaService";

export default function EditarMesa(){

    const params = useParams()
    const router = useRouter()
    const codigo = Number(params.codigo);

    const [mesa,setMesa] = useState<Mesa|null>(null);

    useEffect(()=>
    {
        const buscarDados = async ()=>{
          const mesaResult = await buscarMesaPorId(codigo)

          if (mesaResult) setMesa(mesaResult)
            else router.push("/mesas")
        }

        buscarDados();
    },[codigo, router]);

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

                <div className="space-y-1 border-l-4 border-blue-500 pl-4">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {codigo ? `Editar Mesa #${codigo}` : 'Cadastro de Nova Mesa'}
                    </h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
                <MesaForm mesaExistente={mesa} />
            </div>
        </div>
    </div>
    );
}
