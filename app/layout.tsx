import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import { Providers } from "@/components/Providers";
import { GlobalStatusBar } from "@/components/GlobalStatusBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3654",
};

export const metadata: Metadata = {
  title: "AISA - Sistema de Gestión de Lubricación",
  description: "Plataforma de control y planificación de mantenimiento de lubricación industrial",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AISA Lub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} ${oswald.variable}`}>
      <head>
        {/* PWA Service Worker Registration */}
        {/* Note: next-pwa might auto-register, but explicit registration ensures control */}
      </head>
      <body>
        <Providers>
          <GlobalStatusBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

