import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — Avaliação funcional do ombro`,
  description: APP_CONFIG.tagline,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-moveo-bg text-moveo-ink antialiased">
        {children}
      </body>
    </html>
  );
}
