import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/client-layout";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luma Events",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
    date: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/shortcut-icon.png"],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://dionor.com.br",
    title: "Dionor - Melhores Eventos de Rondônia",
    description: "Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil",
    siteName: "Dionor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dionor - Melhores Eventos de Rondônia",
    description: "Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil",
    creator: "@dionor",
  },
  verification: {
    google: "google-site-verification-code",
    other: {
      me: ["mailto:contato@dionor.com.br"],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.variable}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}