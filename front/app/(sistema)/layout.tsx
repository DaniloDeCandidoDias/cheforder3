'use client'
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export default function SistemaLayout({ children }:
  { children: React.ReactNode }) {

  const usuario = useSelector((state :RootState) => state.auth.usuario);
  const router = useRouter();
  const pathname = usePathname();
  const [montado, setMontado] = useState(false);
  const rotaFuncionarios = pathname === "/usuarios" || pathname.startsWith("/usuarios/");
  const podeAcessarFuncionarios = usuario?.role === "ROLE_ADMIN";

  useEffect(() => {
    const timer = window.setTimeout(() => setMontado(true), 0);
    return () => window.clearTimeout(timer);
  }, [])

  useEffect(() => {
    if (montado && usuario == null) {
      router.push("/login")
    }
  }, [montado, router, usuario])

  useEffect(() => {
    if (montado && usuario != null && rotaFuncionarios && !podeAcessarFuncionarios) {
      router.push("/home")
    }
  }, [montado, podeAcessarFuncionarios, rotaFuncionarios, router, usuario])

  if (!montado || usuario == null) return null;
  if (rotaFuncionarios && !podeAcessarFuncionarios) return null;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
