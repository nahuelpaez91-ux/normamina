"use client";

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
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PASOS.map((p) => (
        <div key={p.n} className="rounded-xl border border-white/10 bg-stone-900/40 p-5">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-oro-500/20 text-sm font-bold text-oro-300">
            {p.n}
          </div>
          <h3 className="font-display text-base font-semibold text-white">{p.titulo}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-400">{p.texto}</p>
        </div>
      ))}
    </div>
  );
}
