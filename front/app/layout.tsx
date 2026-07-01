import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./redux/StoreProvider";

export const metadata: Metadata = {
  title: "ChefOrder",
  description: "Sistema de gerenciamento de restaurantes, mesas, cardapio e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body>
        <StoreProvider>
            {children}
        </StoreProvider>

      </body>
    </html>
  );
}
