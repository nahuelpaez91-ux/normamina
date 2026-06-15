/**
 * Tipos compartidos de la capa de IA.
 * Mantener estos tipos estables permite cambiar de proveedor (Gemini, Groq,
 * Xenova, etc.) sin tocar el resto de la aplicación.
 */

/** Fragmento de documento recuperado de la base vectorial. */
export interface Chunk {
  contenido: string;
  documento: string;
  articulo: string;
  /** Similitud coseno con la pregunta (0 a 1). Opcional en ingesta. */
  similitud?: number;
  metadata?: Record<string, unknown>;
}

/** Fuente citada que se muestra en el panel lateral. */
export interface Fuente {
  documento: string;
  articulo: string;
  contenido: string;
  similitud?: number;
}

/** Resultado de generar una respuesta a partir de chunks. */
export interface RespuestaIA {
  respuesta: string;
  fuentes: Fuente[];
}
