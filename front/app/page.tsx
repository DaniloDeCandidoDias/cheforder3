'use client';

import Link from "next/link";

export default function LandingPage() {

  return (
    <div className="flex flex-col w-full -mt-8">

      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-3 mb-6 text-xs font-bold tracking-widest text-zinc-500 uppercase bg-zinc-100 rounded-full">
            Gestao de restaurantes
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-8">
            ChefOrder<span className="text-zinc-400">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Controle mesas, cardapio, funcionarios e pedidos de cada restaurante em um unico sistema.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all transform hover:-translate-y-1 inline-block text-center"
            >
              Acessar Sistema
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-white text-zinc-900 border border-zinc-200 font-bold rounded-xl hover:bg-zinc-50 transition-all inline-block text-center"
            >
              Entrar como Restaurante
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative p-2 bg-white border border-zinc-200 rounded-3xl shadow-2xl">
                <div className="aspect-square bg-zinc-100 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 7h16M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V5a3 3 0 0 1 6 0v2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Operacao do restaurante</h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                O ChefOrder organiza o atendimento desde a mesa livre ate o fechamento da conta, mantendo cada restaurante com seus proprios dados.
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Cada login acessa somente seus funcionarios, mesas, produtos e pedidos, preservando o controle multiempresa do sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Modulos</h2>
            <div className="h-1 w-20 bg-zinc-900 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {["Mesas", "Cardapio", "Funcionarios", "Pedidos"].map((item) => (
              <div key={item} className="group p-8 border border-zinc-100 rounded-3xl hover:border-zinc-300 transition-all hover:shadow-xl hover:shadow-zinc-100">
                <h3 className="text-xl font-bold text-zinc-900">{item}</h3>
                <p className="mt-4 text-zinc-600">Controle operacional integrado ao restaurante autenticado.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
