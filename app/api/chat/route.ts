import { NextResponse } from "next/server";
import { generarEmbedding, generarRespuesta, type Chunk } from "@/lib/ai";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Cantidad de fragmentos a recuperar. */
const K = 5;
/** Umbral mínimo de similitud coseno para considerar un fragmento relevante. */
const UMBRAL_SIMILITUD = 0.4;

const SIN_INFO =
  "No encuentro esa información en los documentos cargados. Probá reformular la pregunta " +
  "o consultá sobre otro tema cubierto por la normativa disponible.";

export async function POST(req: Request) {
  try {
    const { pregunta } = await req.json();

    if (!pregunta || typeof pregunta !== "string" || !pregunta.trim()) {
      return NextResponse.json(
        { error: "Falta la pregunta." },
        { status: 400 }
      );
    }

    // 1. Embedding de la pregunta
    const embedding = await generarEmbedding(pregunta);

    // 2. Recuperación por similitud en Supabase (pgvector)
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc("match_documentos", {
      query_embedding: embedding,
      match_count: K,
    });

    if (error) {
      console.error("Error en match_documentos:", error.message);
      return NextResponse.json(
        {
          error:
            "Error al consultar la base de datos. ¿Corriste supabase/schema.sql y la ingesta?",
        },
        { status: 500 }
      );
    }

    const chunks: Chunk[] = (data ?? []).filter(
      (d: Chunk) => (d.similitud ?? 0) >= UMBRAL_SIMILITUD
    );

    // 3. Guardrail anti-invención: sin contexto relevante, no se llama al LLM.
    if (chunks.length === 0) {
      return NextResponse.json({ respuesta: SIN_INFO, fuentes: [] });
    }

    // 4. Generación basada exclusivamente en los chunks recuperados
    const { respuesta, fuentes } = await generarRespuesta(pregunta, chunks);

    // Si el modelo igualmente no encontró respuesta en el contexto, no mostramos
    // fuentes (evita tarjetas irrelevantes en una respuesta de "no sé").
    const seRindio = /no encuentro esa información/i.test(respuesta);

    return NextResponse.json({ respuesta, fuentes: seRindio ? [] : fuentes });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error desconocido.";
    console.error("Error en /api/chat:", mensaje);

    // Mensaje amable ante saturación/cuota del proveedor de IA (free tier).
    const saturado = /\[(429|503)|overloaded|high demand|Service Unavailable|quota/i.test(
      mensaje
    );
    if (saturado) {
      return NextResponse.json(
        {
          error:
            "El servicio de IA está con mucha demanda en este momento. Esperá unos segundos y volvé a intentar.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Ocurrió un error procesando la consulta. Intentá nuevamente." },
      { status: 500 }
    );
  }
}
