"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { Providers } from "@/components/providers";
import Header from "@/components/header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove o atributo indesejado do body após a montagem
    document.body.removeAttribute("cz-shortcut-listen");
  }, []);

  return (
    <AuthProvider>
      <Providers>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary"
        >
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="mt-auto py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Dionor Eventos. Todos os direitos reservados.
          </div>
        </footer>
      </Providers>
    </AuthProvider>
  );
}