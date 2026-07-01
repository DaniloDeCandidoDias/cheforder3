'use client'

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Sidebar() {
    const usuario = useSelector((state: RootState) => state.auth.usuario);
    const menus = [
        { href: "/home", label: "Dashboard" },
        { href: "/mesas", label: "Mesas" },
        { href: "/produtos", label: "Cardapio" },
        ...(usuario?.role === "ROLE_ADMIN" ? [{ href: "/usuarios", label: "Funcionarios" }] : []),
        { href: "/pedidos", label: "Pedidos" },
    ];

    return (
        <aside className="sticky top-0 h-screen w-64 bg-slate-900 text-slate-50 flex flex-col border-r border-slate-800 shrink-0">
            <div className="p-6 text-2xl font-bold border-b border-slate-800">
                ChefOrder<span className="text-blue-500">.</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-300 hover:text-white group"
                    >
                        <span className="font-medium">{menu.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
