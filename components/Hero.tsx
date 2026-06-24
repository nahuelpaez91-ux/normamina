export default function Hero() {
  return (
    <section className="estratos relative overflow-hidden rounded-3xl border border-white/10 px-6 py-14 sm:px-10 sm:py-20">
      {/* glow dorado */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-oro-500/20 blur-3xl" />

      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-oro-500/30 bg-oro-500/10 px-3 py-1 text-xs font-medium text-oro-300">
          <span className="h-1.5 w-1.5 rounded-full bg-oro-400" />
          Asistente de IA · RAG sobre documentos
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
          Respuestas con la{" "}
          <span className="text-oro-gradient">fuente exacta</span>, sobre tu normativa.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
          <strong className="text-white">NormaMina</strong> es un asistente con inteligencia
          artificial que responde preguntas sobre normativa minera y <strong className="text-white">cita
          siempre el documento y el artículo</strong> de donde sale cada dato. Si la información no
          está en los documentos cargados, lo dice — no inventa.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#demo" className="btn-oro">
            Probar la demo
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="https://github.com/nahuelpaez91-ux/normamina"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-stone-200 transition hover:bg-white/5"
          >
            Ver código
          </a>
        </div>

        <p className="mt-6 text-xs text-stone-500">
          Demo cargada con normativa minera real de muestra (Código de Minería de la Nación y normas de La Rioja).
        </p>
      </div>
    </section>
  );
}
