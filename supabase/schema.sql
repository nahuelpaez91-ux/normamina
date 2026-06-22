-- ============================================================
-- NormaMina — esquema de base de datos (Supabase / Postgres + pgvector)
--
-- Cómo usarlo:
--   1. Entrá a tu proyecto Supabase.
--   2. Abrí "SQL Editor" > "New query".
--   3. Pegá TODO este archivo y ejecutá ("Run").
--
-- Embeddings: text-embedding-004 de Gemini -> vectores de 768 dimensiones.
-- ============================================================

-- 1. Extensión pgvector
create extension if not exists vector;

-- 2. Tabla de fragmentos de documentos
create table if not exists documentos (
  id          bigint generated always as identity primary key,
  contenido   text not null,                 -- texto del chunk
  documento   text not null,                 -- nombre de la norma / documento
  articulo    text,                          -- cita: "Art. 233", "Sección 2", etc.
  metadata    jsonb not null default '{}'::jsonb,
  embedding   vector(768),                   -- embedding del contenido
  creado_en   timestamptz not null default now()
);

-- 3. Búsqueda por similitud
-- NO usamos un índice aproximado (ivfflat/hnsw): con decenas o cientos de
-- chunks, la búsqueda exacta (seq scan) es instantánea y tiene recall perfecto.
-- Un índice ivfflat con pocas filas degrada mucho el recall.
-- Si en el futuro cargás MILES de documentos, podés crear un índice así
-- (ajustando `lists` ~= filas/1000) y subir `ivfflat.probes` en la sesión:
--   create index on documentos using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 4. Función de recuperación: devuelve los chunks más similares a la pregunta
create or replace function match_documentos (
  query_embedding vector(768),
  match_count int default 5
)
returns table (
  id        bigint,
  contenido text,
  documento text,
  articulo  text,
  similitud float
)
language sql
stable
as $$
  select
    d.id,
    d.contenido,
    d.documento,
    d.articulo,
    1 - (d.embedding <=> query_embedding) as similitud
  from documentos d
  where d.embedding is not null
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
