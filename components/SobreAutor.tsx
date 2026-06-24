export default function SobreAutor() {
  return (
    <section id="contacto" className="scroll-mt-24">
      <div className="estratos relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-oro-500/10 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-oro-400 to-oro-600 font-display text-3xl font-extrabold text-stone-950 shadow-lg shadow-oro-900/40">
            AP
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-oro-400">
              Sobre el autor
            </p>
            <h2 className="font-display text-2xl font-bold text-white">Andrés Nahuel Páez</h2>
            <p className="text-stone-400">Desarrollador de soluciones con IA · La Rioja, Argentina</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300">
              Construyo herramientas de inteligencia artificial sobre documentos: asistentes que
              responden con precisión y citan la fuente. ¿Querés una versión con los documentos de tu
              organización? Hablemos.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href="mailto:nahuelpaez91@gmail.com" className="btn-oro">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
                Escribime
              </a>
              <a
                href="https://wa.me/5493804262454"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-stone-200 transition hover:bg-white/5"
              >
                WhatsApp 380 426-2454
              </a>
              <a
                href="https://github.com/nahuelpaez91-ux/normamina"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-stone-200 transition hover:bg-white/5"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
