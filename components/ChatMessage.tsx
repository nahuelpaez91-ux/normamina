"use client";

import type { Mensaje } from "./types";

export default function ChatMessage({ mensaje }: { mensaje: Mensaje }) {
  const esUsuario = mensaje.rol === "usuario";

  return (
    <div className={`flex animate-fade-in-up gap-3 ${esUsuario ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          esUsuario ? "bg-slate-700 text-slate-200" : "bg-mina-500/20 text-mina-300"
        }`}
        aria-hidden
      >
        {esUsuario ? "Vos" : "NM"}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          esUsuario
            ? "rounded-tr-sm bg-mina-600 text-white"
            : "rounded-tl-sm border border-white/10 bg-slate-900/60 text-slate-100"
        }`}
      >
        <p className="respuesta">{mensaje.contenido}</p>

        {!esUsuario && mensaje.fuentes && mensaje.fuentes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
            {mensaje.fuentes.map((f, i) => (
              <span
                key={i}
                className="rounded-md bg-mina-500/10 px-2 py-0.5 text-[11px] font-medium text-mina-300"
                title={`${f.documento} — ${f.articulo}`}
              >
                {f.articulo}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
