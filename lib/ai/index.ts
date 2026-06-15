/**
 * API pública de la capa de IA.
 *
 * El resto de la aplicación importa SOLO desde acá:
 *   import { generarEmbedding, generarRespuesta } from "@/lib/ai";
 *
 * Para cambiar de proveedor, cambiá los imports de abajo por otra
 * implementación (groq.ts, openai.ts, xenova.ts...) que respete la misma firma.
 */
import { embeddingGemini, generarRespuestaGemini } from "./gemini";
import type { Chunk, RespuestaIA } from "./types";

export type { Chunk, Fuente, RespuestaIA } from "./types";

/** Devuelve el vector de embedding de un texto. */
export function generarEmbedding(texto: string): Promise<number[]> {
  return embeddingGemini(texto);
}

/** Genera una respuesta citada a partir de los fragmentos recuperados. */
export function generarRespuesta(
  pregunta: string,
  chunks: Chunk[]
): Promise<RespuestaIA> {
  return generarRespuestaGemini(pregunta, chunks);
}
