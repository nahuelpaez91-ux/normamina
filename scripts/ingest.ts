/**
 * Script de ingesta de documentos.
 *
 * Lee todos los .txt y .pdf de /docs, los divide en chunks por artículo,
 * genera un embedding por chunk y los guarda en Supabase (tabla `documentos`).
 *
 * Uso:
 *   npm run ingest
 *
 * Requiere: .env.local con GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL y
 * SUPABASE_SERVICE_ROLE_KEY, y el esquema ya creado (supabase/schema.sql).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { readdir, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { chunkearTexto } from "../lib/chunk";
import { generarEmbedding } from "../lib/ai";
import { getSupabaseAdmin } from "../lib/supabase";

const DOCS_DIR = join(process.cwd(), "docs");

/** Convierte el nombre de archivo en un nombre de documento legible. */
function nombreDocumento(archivo: string): string {
  return basename(archivo, extname(archivo))
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

async function leerTexto(ruta: string): Promise<string> {
  const ext = extname(ruta).toLowerCase();
  if (ext === ".txt") {
    return readFile(ruta, "utf8");
  }
  if (ext === ".pdf") {
    // Import directo del lib interno para evitar el "debug mode" de pdf-parse.
    const { default: pdf } = await import("pdf-parse/lib/pdf-parse.js");
    const buffer = await readFile(ruta);
    const data = await pdf(buffer);
    return data.text;
  }
  throw new Error(`Extensión no soportada: ${ext}`);
}

async function main() {
  console.log("📚 NormaMina — ingesta de documentos\n");

  const supabase = getSupabaseAdmin();

  let archivos: string[];
  try {
    archivos = (await readdir(DOCS_DIR)).filter((f) =>
      [".txt", ".pdf"].includes(extname(f).toLowerCase())
    );
  } catch {
    console.error(`No pude leer la carpeta ${DOCS_DIR}. ¿Existe /docs?`);
    process.exit(1);
  }

  if (archivos.length === 0) {
    console.error("No hay archivos .txt ni .pdf en /docs.");
    process.exit(1);
  }

  // Reingesta limpia: borramos lo anterior para no duplicar.
  console.log("🧹 Limpiando tabla `documentos`...");
  const { error: delError } = await supabase
    .from("documentos")
    .delete()
    .neq("id", -1);
  if (delError) {
    console.error("Error al limpiar la tabla:", delError.message);
    process.exit(1);
  }

  let totalChunks = 0;

  for (const archivo of archivos) {
    const ruta = join(DOCS_DIR, archivo);
    const documento = nombreDocumento(archivo);
    console.log(`\n📄 ${documento}  (${archivo})`);

    const texto = await leerTexto(ruta);
    const chunks = chunkearTexto(texto);
    console.log(`   → ${chunks.length} chunks`);

    const filas = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      process.stdout.write(`   embeddings ${i + 1}/${chunks.length}\r`);
      const embedding = await generarEmbedding(chunk.contenido);
      filas.push({
        contenido: chunk.contenido,
        documento,
        articulo: chunk.articulo,
        metadata: { archivo },
        embedding,
      });
    }
    process.stdout.write("\n");

    const { error: insError } = await supabase.from("documentos").insert(filas);
    if (insError) {
      console.error(`   ❌ Error al insertar: ${insError.message}`);
      process.exit(1);
    }
    console.log(`   ✅ ${filas.length} chunks guardados`);
    totalChunks += filas.length;
  }

  console.log(`\n🎉 Listo. ${totalChunks} chunks ingeridos de ${archivos.length} documentos.`);
}

main().catch((err) => {
  console.error("\n💥 Falló la ingesta:", err.message);
  process.exit(1);
});
