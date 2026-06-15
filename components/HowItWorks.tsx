"use client";

import { useState } from "react";

const PASOS = [
  {
    n: "1",
    titulo: "Ingesta",
    texto: "Los documentos se dividen en fragmentos y se convierten en vectores (embeddings).",
  },
  {
    n: "2",
    titulo: "Recuperación",
    texto: "Tu pregunta busca los fragmentos más parecidos por similitud semántica.",
  },
  {
    n: "3",
    titulo: "Respuesta citada",
    texto: "La IA responde SOLO con esos fragmentos y muestra de qué artículo salió cada parte.",
  },
];

export default function HowItWorks() {
  const [abierto, setAbierto] = useState(false);

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-mina-500/15 px-3 py-1 text-xs font-medium text-mina-300">
            <span className="h-1.5 w-1.5 rounded-full bg-mina-400" />
            Demo de RAG sobre documentos
          </div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">¿Cómo funciona?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            NormaMina lee normativa minera y responde tus preguntas <strong className="text-white">citando siempre
            el documento y el artículo</strong> de donde sale la información. Si la respuesta no está en
            los documentos, lo dice en vez de inventar.
          </p>
        </div>
        <button
          onClick={() => setAbierto((v) => !v)}
          className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
        >
          {abierto ? "Ocultar" : "Ver más"}
        </button>
      </div>

      {abierto && (
        <div className="mt-5 animate-fade-in-up">
          <div className="grid gap-3 sm:grid-cols-3">
            {PASOS.map((p) => (
              <div key={p.n} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-mina-500/20 text-sm font-bold text-mina-300">
                  {p.n}
                </div>
                <h3 className="text-sm font-semibold text-white">{p.titulo}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-mina-500/20 bg-mina-500/5 p-4 text-sm text-mina-100">
            <strong className="text-mina-300">El demo está cargado con normativa minera.</strong>{" "}
            La <strong>misma herramienta</strong> funciona con cualquier conjunto de documentos —manuales
            internos, contratos, expedientes, ordenanzas— con solo cambiar la carga.
          </div>
        </div>
      )}
    </section>
  );
}
