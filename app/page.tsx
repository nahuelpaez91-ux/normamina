"use client";

import { useState, useRef, useEffect } from "react";
import type { Fuente } from "@/lib/ai/types";
import type { Mensaje } from "@/components/types";
import HowItWorks from "@/components/HowItWorks";
import SourcesPanel from "@/components/SourcesPanel";
import ChatMessage from "@/components/ChatMessage";

const SUGERENCIAS = [
  "¿Qué necesito presentar antes de iniciar una actividad minera?",
  "¿Qué obligaciones ambientales tiene el titular de una mina?",
  "¿Qué pasa si no pago el canon minero?",
  "¿Quién es la autoridad minera en La Rioja?",
];

export default function Home() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  // Fuentes de la última respuesta del asistente para el panel lateral.
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
      setMensajes((prev) => [
        ...prev,
        {
          rol: "asistente",
          contenido: `⚠️ ${msg}`,
          fuentes: [],
        },
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-mina-400 to-mina-600 font-black text-slate-950 shadow-lg shadow-mina-500/20">
            NM
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-white">NormaMina</h1>
            <p className="mt-1 text-xs text-slate-400">
              Asistente IA de normativa minera · con fuentes
            </p>
          </div>
        </div>
        <a
          href="https://github.com/nahuelpaez91-ux/normamina"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 sm:inline-block"
        >
          Ver código en GitHub
        </a>
      </header>

      <HowItWorks />

      {/* Cuerpo: chat + fuentes */}
      <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_340px]">
        {/* Columna chat */}
        <main className="glass flex min-h-[60vh] flex-col rounded-2xl">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {mensajes.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mina-500/15 text-2xl">
                  ⛏️
                </div>
                <h2 className="text-base font-semibold text-white">
                  Preguntá sobre normativa minera
                </h2>
                <p className="mt-1 max-w-md text-sm text-slate-400">
                  Cada respuesta cita el documento y el artículo exactos. Probá con una de estas:
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      onClick={() => preguntar(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-mina-500/40 hover:bg-mina-500/10"
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
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex gap-1">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-mina-400" />
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-mina-400 [animation-delay:0.2s]" />
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-mina-400 [animation-delay:0.4s]" />
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
                className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-mina-500/50 focus:outline-none focus:ring-1 focus:ring-mina-500/50"
              />
              <button
                type="submit"
                disabled={cargando || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mina-600 text-white transition hover:bg-mina-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <p className="mt-2 text-[11px] text-slate-500">
              Información orientativa basada en los documentos cargados. No constituye asesoramiento legal.
            </p>
          </form>
        </main>

        {/* Columna fuentes */}
        <div className="glass rounded-2xl p-5">
          <SourcesPanel fuentes={ultimasFuentes} />
        </div>
      </div>

      <footer className="mt-2 space-y-3 border-t border-white/10 pb-4 pt-5 text-center text-xs text-slate-500">
        <div>
          <p className="text-sm font-semibold text-slate-200">Andrés Nahuel Páez</p>
          <p className="text-slate-400">Desarrollador de soluciones con IA · La Rioja, Argentina</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a className="transition hover:text-mina-300" href="mailto:nahuelpaez91@gmail.com">
            nahuelpaez91@gmail.com
          </a>
          <a
            className="transition hover:text-mina-300"
            href="https://wa.me/5493804262454"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: 380 426-2454
          </a>
          <a
            className="transition hover:text-mina-300"
            href="https://github.com/nahuelpaez91-ux/normamina"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <div className="text-slate-600">
          RAG con Next.js, Supabase (pgvector) y Gemini · Textos de muestra con fines de demostración.
        </div>
      </footer>
    </div>
  );
}
