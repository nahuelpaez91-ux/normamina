/**
 * Chunking de documentos normativos.
 *
 * Estrategia: dividir POR ARTÍCULO para preservar la cita exacta (cada chunk
 * sabe a qué artículo pertenece). Si un artículo es muy largo, se subdivide por
 * tamaño manteniendo la misma etiqueta de artículo. Si el documento no tiene
 * estructura de artículos, se cae a un chunking por tamaño.
 */

const MAX_CHARS = 1500;

export interface ChunkCrudo {
  contenido: string;
  /** Etiqueta de cita, p. ej. "Art. 233" o "Sección 2". */
  articulo: string;
}

/** Detecta encabezados tipo "Artículo 233", "ARTÍCULO N° 7", "Art. 14 bis". */
const ARTICULO_RE =
  /(?:^|\n)\s*(?:Art[íi]culo|ART[ÍI]CULO|Art\.)\s*N?[°º]?\s*(\d+\s*(?:bis|ter)?[°º]?)/g;

function partirPorTamano(texto: string, etiqueta: string): ChunkCrudo[] {
  const partes: ChunkCrudo[] = [];
  const parrafos = texto.split(/\n{2,}/);
  let buffer = "";

  const empujar = () => {
    const limpio = buffer.trim();
    if (limpio) partes.push({ contenido: limpio, articulo: etiqueta });
    buffer = "";
  };

  for (const p of parrafos) {
    if ((buffer + "\n\n" + p).length > MAX_CHARS && buffer) empujar();
    buffer += (buffer ? "\n\n" : "") + p;
  }
  empujar();
  return partes;
}

export function chunkearTexto(texto: string): ChunkCrudo[] {
  const limpio = texto.replace(/\r\n/g, "\n").trim();
  if (!limpio) return [];

  const matches = [...limpio.matchAll(ARTICULO_RE)];

  // Sin estructura de artículos -> chunking por tamaño, en secciones.
  if (matches.length === 0) {
    const bloques = partirPorTamano(limpio, "Sección");
    return bloques.map((b, i) => ({ ...b, articulo: `Sección ${i + 1}` }));
  }

  const chunks: ChunkCrudo[] = [];

  // Texto previo al primer artículo (preámbulo/título), si tiene contenido útil.
  const preambulo = limpio.slice(0, matches[0].index ?? 0).trim();
  if (preambulo.length > 40) {
    chunks.push({ contenido: preambulo, articulo: "Preámbulo" });
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = m.index ?? 0;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? limpio.length) : limpio.length;
    const contenido = limpio.slice(start, end).trim();
    const numero = m[1].replace(/\s+/g, " ").trim();
    const etiqueta = `Art. ${numero}`;

    if (contenido.length > MAX_CHARS) {
      for (const sub of partirPorTamano(contenido, etiqueta)) chunks.push(sub);
    } else if (contenido) {
      chunks.push({ contenido, articulo: etiqueta });
    }
  }

  return chunks;
}
