/**
 * Implementación del proveedor de IA con Google Gemini (free tier).
 *
 * Este es el ÚNICO archivo que conoce los detalles del proveedor. Para cambiar
 * a Groq, OpenAI, Xenova, etc., creá un archivo análogo (p. ej. `groq.ts`) que
 * exporte `embeddingGemini`/`generarRespuestaGemini` equivalentes y cambiá el
 * import en `lib/ai/index.ts`. El resto de la app no se entera.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Chunk, Fuente, RespuestaIA } from "./types";

const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash";
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "text-embedding-004";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno GEMINI_API_KEY. " +
        "Obtené una en https://aistudio.google.com/app/apikey y agregala a .env.local"
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/** Genera el embedding de un texto. text-embedding-004 devuelve 768 dimensiones. */
export async function embeddingGemini(texto: string): Promise<number[]> {
  const model = getClient().getGenerativeModel({ model: EMBED_MODEL });
  const res = await model.embedContent(texto);
  return res.embedding.values;
}

const SYSTEM_INSTRUCTION = `Sos NormaMina, un asistente experto en normativa minera argentina.

Reglas estrictas:
- Respondé ÚNICAMENTE con la información contenida en los fragmentos provistos.
- Si la respuesta no está en los fragmentos, decí claramente: "No encuentro esa información en los documentos cargados." No inventes ni completes con conocimiento externo.
- Citá siempre el documento y el artículo de donde sacás cada afirmación, usando el formato (Documento, Art. N).
- Respondé en español rioplatense, de forma clara y profesional.
- No des asesoramiento legal vinculante; aclará que es información orientativa basada en los documentos.`;

function construirContexto(chunks: Chunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[Fragmento ${i + 1}] Documento: "${c.documento}" — ${c.articulo}\n${c.contenido}`
    )
    .join("\n\n---\n\n");
}

function chunksAFuentes(chunks: Chunk[]): Fuente[] {
  return chunks.map((c) => ({
    documento: c.documento,
    articulo: c.articulo,
    contenido: c.contenido,
    similitud: c.similitud,
  }));
}

/** Genera una respuesta basada exclusivamente en los chunks recuperados. */
export async function generarRespuestaGemini(
  pregunta: string,
  chunks: Chunk[]
): Promise<RespuestaIA> {
  const model = getClient().getGenerativeModel({
    model: CHAT_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const prompt = `Fragmentos de normativa disponibles:\n\n${construirContexto(
    chunks
  )}\n\n=========\n\nPregunta del usuario: ${pregunta}\n\nRespondé citando los artículos correspondientes.`;

  const result = await model.generateContent(prompt);
  const respuesta = result.response.text().trim();

  return {
    respuesta,
    fuentes: chunksAFuentes(chunks),
  };
}
