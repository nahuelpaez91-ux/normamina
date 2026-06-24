"use client";

import type { Fuente } from "@/lib/ai/types";

export default function SourcesPanel({ fuentes }: { fuentes: Fuente[] }) {
  return (
    <aside className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <svg className="h-4 w-4 text-oro-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-300">
          Fuentes citadas
        </h2>
        {fuentes.length > 0 && (
          <span className="rounded-full bg-oro-500/20 px-2 py-0.5 text-xs font-medium text-oro-300">
            {fuentes.length}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {fuentes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-stone-500">
            Las fuentes de cada respuesta aparecerán acá: el documento y el artículo exactos
            que respaldan lo que dice la IA.
          </div>
        ) : (
          fuentes.map((f, i) => (
            <article
              key={`${f.documento}-${f.articulo}-${i}`}
              className="animate-fade-in-up rounded-xl border border-white/10 bg-stone-900/50 p-4 transition hover:border-oro-500/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-md bg-oro-500/15 px-2 py-0.5 text-xs font-semibold text-oro-300">
                  {f.articulo}
                </span>
                {typeof f.similitud === "number" && (
                  <span className="text-[11px] font-medium text-stone-500">
                    {Math.round(f.similitud * 100)}% relevancia
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-stone-300">{f.documento}</p>
              <p className="mt-2 line-clamp-5 text-xs leading-relaxed text-stone-400">
                {f.contenido}
              </p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
