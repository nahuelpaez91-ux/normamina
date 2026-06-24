const REQUISITOS = [
  {
    titulo: "Documentos oficiales y vigentes",
    texto:
      "La respuesta es tan confiable como la fuente. Hay que cargar las versiones oficiales y actualizadas de cada norma o documento.",
  },
  {
    titulo: "Texto legible (no escaneos)",
    texto:
      "PDFs con texto seleccionable o archivos .txt. Una foto o escaneo sin OCR no se puede leer correctamente.",
  },
  {
    titulo: "Estructura identificable",
    texto:
      "Artículos, secciones o cláusulas numeradas permiten que cada cita sea precisa y verificable.",
  },
  {
    titulo: "Actualización al cambiar la norma",
    texto:
      "Cuando una norma se modifica, se vuelve a cargar el documento para que el asistente no responda con texto viejo.",
  },
];

export default function DatosCertera() {
  return (
    <section id="datos" className="scroll-mt-24">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-oro-400">
            Qué necesita para ser certero
          </p>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            La IA es tan precisa como los documentos que le das
          </h2>
          <p className="mt-3 text-stone-400">
            NormaMina no inventa: responde únicamente con los documentos cargados y cita la fuente.
            Por eso la calidad del resultado depende directamente de la calidad de esa base
            documental.
          </p>
          <div className="mt-5 rounded-xl border border-oro-500/20 bg-oro-500/5 p-4 text-sm text-oro-100">
            En una implementación real, se arma junto al cliente el conjunto de documentos oficiales
            y se define un proceso de actualización.
          </div>
        </div>

        <div className="space-y-3">
          {REQUISITOS.map((r, i) => (
            <div key={r.titulo} className="flex gap-4 rounded-xl border border-white/10 bg-stone-900/40 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-oro-500/15 text-sm font-bold text-oro-300">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white">{r.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-400">{r.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
