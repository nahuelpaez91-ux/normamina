"use client";

import { useState, useRef, useEffect } from "react";
import type { Fuente } from "@/lib/ai/types";
import type { Mensaje } from "@/components/types";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CasosDeAplicacion from "@/components/CasosDeAplicacion";
import DatosCertera from "@/components/DatosCertera";
import SobreAutor from "@/components/SobreAutor";
import SourcesPanel from "@/components/SourcesPanel";
import ChatMessage from "@/components/ChatMessage";

const SUGERENCIAS = [
  "¿Qué necesito presentar antes de iniciar una actividad minera?",
  "¿Qué obligaciones ambientales tiene el titular de una mina?",
  "¿Qué pasa si no pago el canon minero?",
  "¿Quién es la autoridad minera en La Rioja?",
];

const NAV = [
  { href: "#demo", label: "Demo" },
  { href: "#casos", label: "Casos" },
  { href: "#datos", label: "Precisión" },
  { href: "#contacto", label: "Contacto" },
];

export default function Home() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  const ultimasFuentes: Fuente[] =
    [...mensajes].reverse().find((m) => m.rol === "asistente")?.fuentes ?? [];

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  async function preguntar(texto: string) {
    const pregunta = texto.trim();
    if (!pregunta || cargando) return;

    setError(null);
    setInput("");
    setMensajes((prev) => [...prev, { rol: "usuario", contenido: pregunta }]);
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al consultar.");

      setMensajes((prev) => [
        ...prev,
        { rol: "asistente", contenido: data.respuesta, fuentes: data.fuentes ?? [] },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido.";
      setError(msg);
      setMensajes((prev) => [...prev, { rol: "asistente", contenido: `⚠️ ${msg}`, fuentes: [] }]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header sticky */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-oro-400 to-oro-600 font-display text-sm font-extrabold text-stone-950">
              NM
            </span>
            <span className="font-display text-lg font-bold text-white">NormaMina</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-stone-300 transition hover:text-oro-300">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#demo" className="rounded-lg bg-oro-500 px-4 py-2 text-xs font-semibold text-stone-950 transition hover:bg-oro-400">
            Probar demo
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl space-y-20 px-4 py-10 sm:px-6 sm:py-14">
        <Hero />

        <CasosDeAplicacion />

        {/* DEMO */}
        <section id="demo" className="scroll-mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-oro-400">
              Demo en vivo
            </p>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Preguntá y mirá las fuentes
            </h2>
            <p className="mt-3 text-stone-400">
              Cargada con normativa minera real de muestra. Cada respuesta cita el documento y el
              artículo; si no hay info, lo dice.
            </p>
          </div>

          <div className="mb-6">
            <HowItWorks />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            {/* Chat */}
            <div className="glass flex min-h-[60vh] flex-col rounded-2xl">
              <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                {mensajes.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-oro-500/15 text-2xl">
                      ⛏️
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      Preguntá sobre normativa minera
                    </h3>
                    <p className="mt-1 max-w-md text-sm text-stone-400">
                      Cada respuesta cita el documento y el artículo exactos. Probá con una de estas:
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {SUGERENCIAS.map((s) => (
                        <button
                          key={s}
                          onClick={() => preguntar(s)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-200 transition hover:border-oro-500/40 hover:bg-oro-500/10"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  mensajes.map((m, i) => <ChatMessage key={i} mensaje={m} />)
                )}

                {cargando && (
                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-oro-400" />
                      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-oro-400 [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-oro-400 [animation-delay:0.4s]" />
                    </span>
                    Buscando en los documentos…
                  </div>
                )}
                <div ref={finRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  preguntar(input);
                }}
                className="border-t border-white/10 p-4"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        preguntar(input);
                      }
                    }}
                    rows={1}
                    placeholder="Escribí tu pregunta sobre la normativa…"
                    className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-stone-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-oro-500/50 focus:outline-none focus:ring-1 focus:ring-oro-500/50"
                  />
                  <button
                    type="submit"
                    disabled={cargando || !input.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-oro-500 text-stone-950 transition hover:bg-oro-400 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Enviar"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                <p className="mt-2 text-[11px] text-stone-500">
                  Información orientativa basada en los documentos cargados. No constituye asesoramiento legal.
                </p>
              </form>
            </div>

            {/* Fuentes */}
            <div className="glass rounded-2xl p-5">
              <SourcesPanel fuentes={ultimasFuentes} />
            </div>
          </div>
        </section>

        <DatosCertera />

        <SobreAutor />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-stone-600">
        NormaMina · RAG con Next.js, Supabase (pgvector) y Gemini · Textos de muestra con fines de demostración.
      </footer>
    </div>
  );
}
