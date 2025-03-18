import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/client-layout";
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
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
