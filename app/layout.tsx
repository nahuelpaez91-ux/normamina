import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "NormaMina — Asistente IA de normativa minera con fuentes",
  description:
    "Asistente con IA que responde preguntas sobre normativa minera citando siempre la fuente (documento y artículo). Demo de RAG sobre documentos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
