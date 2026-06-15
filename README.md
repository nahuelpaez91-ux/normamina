# ⛏️ NormaMina

**Asistente con IA que responde preguntas sobre normativa minera y SIEMPRE cita la fuente** (documento + artículo/sección). Es una demostración de **RAG (Retrieval-Augmented Generation) sobre documentos**: la IA solo responde con lo que está en los documentos cargados y, si no encuentra la información, lo dice en vez de inventar.

> **El demo está cargado con normativa minera.** La _misma herramienta_ funciona con cualquier conjunto de documentos —manuales internos, contratos, expedientes, ordenanzas— con solo cambiar la carga.

---

## ✨ Características

- 🔎 **Respuestas con fuentes:** cada respuesta muestra de qué documento y artículo salió cada parte.
- 🛡️ **No inventa:** si los documentos no cubren la pregunta, lo dice.
- 🧩 **Capa de IA modular:** `generarRespuesta()` y `generarEmbedding()` se cambian de proveedor sin tocar el resto.
- 💸 **100% free tier:** Gemini (LLM + embeddings), Supabase (pgvector), Vercel (Hobby).
- 📥 **Ingesta de PDF y .txt** con chunking por artículo para preservar la cita exacta.

## 🏗️ Stack

| Capa        | Tecnología                                             |
| ----------- | ------------------------------------------------------ |
| Frontend    | Next.js 14 (App Router) + TypeScript + Tailwind CSS    |
| Base vector | Supabase (Postgres + extensión `pgvector`)            |
| LLM         | Google Gemini (`gemini-2.0-flash`)                     |
| Embeddings  | Google Gemini (`text-embedding-004`, 768 dims)         |
| Deploy      | Vercel (plan Hobby)                                    |

La capa de IA vive en `lib/ai/`. Para cambiar de proveedor (Groq, Xenova local, OpenAI…), creá un archivo análogo a `lib/ai/gemini.ts` y cambiá los imports de `lib/ai/index.ts`. El resto de la app no se entera.

---

## 🚀 Puesta en marcha (local)

### 1. Requisitos

- Node.js 18.18+ (recomendado 20+)
- Una cuenta gratis de [Supabase](https://supabase.com)
- Una API key gratis de [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Creá un proyecto nuevo en Supabase (plan free).
2. Abrí **SQL Editor → New query**, pegá el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecutá (**Run**). Esto crea la extensión `pgvector`, la tabla `documentos` y la función `match_documentos`.
3. En **Settings → API** copiá la **Project URL** y la **service_role key**.

### 4. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_CHAT_MODEL=gemini-2.0-flash
GEMINI_EMBED_MODEL=text-embedding-004
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

> ⚠️ La `service_role` key es secreta y solo se usa server-side. Nunca la subas al repo (`.env.local` ya está en `.gitignore`).

### 5. Cargar los documentos (ingesta)

```bash
npm run ingest
```

Esto lee todos los `.txt` y `.pdf` de [`/docs`](docs), los divide en chunks por artículo, genera los embeddings con Gemini y los guarda en Supabase. Verás el progreso por documento.

### 6. Levantar la app

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y empezá a preguntar.

---

## 📄 Cargar tus propios documentos

1. Poné tus archivos `.txt` o `.pdf` en la carpeta [`/docs`](docs) (podés borrar los de muestra).
2. Volvé a correr `npm run ingest` (cada ingesta limpia la tabla y la recarga, así no se duplica).
3. Listo: el chat ya responde sobre tus documentos.

El chunking detecta encabezados tipo `Artículo N` para usarlos como cita. Si tus documentos no tienen artículos, se dividen en secciones por tamaño automáticamente.

---

## ☁️ Deploy en Vercel

1. Subí el proyecto a un repositorio de GitHub.
2. En [Vercel](https://vercel.com) → **Add New → Project** e importá el repo.
3. En **Environment Variables** cargá las mismas variables de `.env.local`
   (`GEMINI_API_KEY`, `GEMINI_CHAT_MODEL`, `GEMINI_EMBED_MODEL`,
   `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
4. **Deploy**.

> La ingesta (`npm run ingest`) se corre **localmente** una vez (o cada vez que cambiás los documentos); escribe directo en tu Supabase, que es la misma base que usa la app en producción. No hace falta correrla en Vercel.

---

## 🗂️ Estructura del proyecto

```
docs/                       Documentos de muestra (normativa minera)
scripts/ingest.ts           Ingesta: docs → chunks → embeddings → Supabase
supabase/schema.sql         Tabla + pgvector + función de similitud
lib/ai/
  index.ts                  API pública: generarRespuesta() y generarEmbedding()
  gemini.ts                 Implementación del proveedor (único archivo a cambiar)
  types.ts                  Tipos compartidos
lib/chunk.ts                Chunking por artículo
lib/supabase.ts             Cliente Supabase (server-side)
app/api/chat/route.ts       Endpoint del chat (embed → match → respuesta)
app/page.tsx                UI del chat
components/                  HowItWorks, SourcesPanel, ChatMessage
```

## 🔄 Cómo funciona (RAG en 3 pasos)

1. **Ingesta:** los documentos se dividen en fragmentos y se convierten en vectores (embeddings) guardados en pgvector.
2. **Recuperación:** tu pregunta se vectoriza y se buscan los fragmentos más similares por similitud coseno.
3. **Respuesta citada:** la IA recibe SOLO esos fragmentos y responde citando el documento y artículo. Si la similitud es baja, responde que no encuentra la información.

---

## ⚖️ Aviso

Los textos en `/docs` son **de muestra, con fines de demostración**, y no constituyen la versión oficial vigente de ninguna norma. La herramienta brinda información orientativa basada en los documentos cargados y **no constituye asesoramiento legal**.
