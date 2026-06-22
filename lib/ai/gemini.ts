/**
 * Implementación del proveedor de IA con Google Gemini (free tier).
 *
 * Este es el ÚNICO archivo que conoce los detalles del proveedor. Para cambiar
 * a Groq, OpenAI, Xenova, etc., creá un archivo análogo (p. ej. `groq.ts`) que
 * exporte `embeddingGemini`/`generarRespuestaGemini` equivalentes y cambiá el
 * import en `lib/ai/index.ts`. El resto de la app no se entera.
 */
import { GoogleGenerativeAI, type EmbedContentRequest } from "@google/generative-ai";
import type { Chunk, Fuente, RespuestaIA } from "./types";

const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
// Dimensiones del embedding. Debe coincidir con la columna vector(N) en Supabase.
const EMBED_DIM = Number(process.env.GEMINI_EMBED_DIM || 768);

/**
 * Reintenta una operación ante errores transitorios de la API
 * (503 sobrecarga, 429 rate limit) con backoff exponencial.
 */
async function conReintentos<T>(fn: () => Promise<T>, intentos = 3): Promise<T> {
  let ultimoError: unknown;
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimoError = e;
      const msg = e instanceof Error ? e.message : String(e);
      const transitorio = /\[(429|500|503)|overloaded|high demand|Service Unavailable/i.test(msg);
      if (!transitorio || i === intentos - 1) throw e;
      await new Promise((r) => setTimeout(r, 800 * 2 ** i)); // 0.8s, 1.6s, 3.2s
    }
  }
  throw ultimoError;
}

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

/** Genera el embedding de un texto, con EMBED_DIM dimensiones. */
export async function embeddingGemini(texto: string): Promise<number[]> {
  const model = getClient().getGenerativeModel({ model: EMBED_MODEL });
  // `outputDimensionality` es soportado por la API (recorta el embedding a N dims)
  // pero el tipo del SDK v0.21 no lo declara; lo extendemos sin recurrir a `any`.
  const req: EmbedContentRequest & { outputDimensionality?: number } = {
    content: { role: "user", parts: [{ text: texto }] },
    outputDimensionality: EMBED_DIM,
  };
  const res = await conReintentos(() => model.embedContent(req));
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

  const result = await conReintentos(() => model.generateContent(prompt));
  const respuesta = result.response.text().trim();

  return {
    respuesta,
    fuentes: chunksAFuentes(chunks),
  };
}
