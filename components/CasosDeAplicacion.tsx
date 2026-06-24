const CASOS = [
  {
    icono: "⛏️",
    titulo: "Normativa minera",
    texto: "Códigos, leyes provinciales, resoluciones y reglamentos del sector.",
  },
  {
    icono: "📐",
    titulo: "Manuales y procedimientos",
    texto: "Manuales internos, protocolos de seguridad e higiene, instructivos operativos.",
  },
  {
    icono: "📝",
    titulo: "Contratos y pliegos",
    texto: "Consultá cláusulas, obligaciones y condiciones citando el punto exacto.",
  },
  {
    icono: "🗂️",
    titulo: "Expedientes y resoluciones",
    texto: "Encontrá qué dice cada actuación administrativa sin leer todo el legajo.",
  },
  {
    icono: "🏛️",
    titulo: "Ordenanzas municipales",
    texto: "Regulaciones locales, ambientales y de uso del suelo.",
  },
  {
    icono: "📋",
    titulo: "Políticas internas",
    texto: "Reglamentos de RRHH, compliance y políticas corporativas.",
  },
];

export default function CasosDeAplicacion() {
  return (
    <section id="casos" className="scroll-mt-24">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-oro-400">
          Para qué sirve
        </p>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          La misma herramienta, cualquier conjunto de documentos
        </h2>
        <p className="mt-3 text-stone-400">
          Hoy está cargada con normativa minera, pero el motor es el mismo para cualquier
          base documental. Solo cambia <span className="text-stone-200">qué documentos se cargan</span>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASOS.map((c) => (
          <div
            key={c.titulo}
            className="group rounded-2xl border border-white/10 bg-stone-900/40 p-5 transition hover:border-oro-500/40 hover:bg-stone-900/70"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-oro-500/10 text-2xl">
              {c.icono}
            </div>
            <h3 className="font-display text-base font-semibold text-white">{c.titulo}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-400">{c.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
