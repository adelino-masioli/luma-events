import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Luma Events - Os Melhores Eventos de Rondônia",
  description: "Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil",
  manifest: "/manifest.json",
  applicationName: "Luma Events",
  keywords: ["eventos", "ingressos", "rondônia", "porto velho", "shows", "festas"],
  authors: [{ name: "Luma Events" }],
  creator: "Luma Events",
  publisher: "Luma Events",
  category: "events",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luma Events",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
    date: false
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-256x256.png", type: "image/png", sizes: "256x256" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/icons/icon-95x95.png", sizes: "95x95", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#4f46e5" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://lumaevents.com.br",
    title: "Luma Events - Os Melhores Eventos de Rondônia",
    description: "Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil",
    siteName: "Luma Events"
  },
  twitter: {
    card: "summary_large_image",
    title: "Luma Events - Os Melhores Eventos de Rondônia",
    description: "Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil",
    creator: "@lumaevents"
  },
  verification: {
    google: "google-site-verification-code",
    other: {
      me: ["mailto:contato@lumaevents.com.br"]
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} >
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning={true}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary">
          Pular para o conteúdo principal
        </a>
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60" role="banner">
          <div className="container flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex gap-6 md:gap-10">
              <a href="/" className="flex items-center space-x-2" aria-label="Luma Events - Página Inicial">
                <span className="font-bold text-xl">Luma</span>
              </a>
              <nav className="hidden md:flex gap-6" role="navigation" aria-label="Menu Principal">
                <a href="/eventos" className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
                  Eventos
                </a>
                <a href="/sobre" className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
                  Sobre
                </a>
                <a href="/contato" className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
                  Contato
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <div className="relative">
                  <label htmlFor="search" className="sr-only">Buscar eventos</label>
                  <input 
                    id="search"
                    type="search" 
                    placeholder="Buscar eventos..." 
                    className="header-search w-[300px]"
                    aria-label="Buscar eventos"
                  />
                </div>
              </div>
              <a href="/carrinho" className="relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1" aria-label="Carrinho de Compras">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-label="Quantidade de itens no carrinho">0</span>
              </a>
              <button 
                className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1" 
                aria-label="Abrir menu de navegação"
                aria-expanded="false"
                aria-controls="mobile-menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <footer className="py-8 border-t" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} Luma Events. Todos os direitos reservados.</p>
              </div>
              <nav className="flex gap-6" aria-label="Links do Rodapé">
                <a href="/politica-de-privacidade" className="text-sm text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Política de Privacidade</a>
                <a href="/termos-de-uso" className="text-sm text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Termos de Uso</a>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
