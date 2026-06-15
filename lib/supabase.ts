/**
 * Cliente de Supabase para uso SERVER-SIDE (API routes y script de ingesta).
 * Usa la service role key, que nunca debe exponerse en el cliente.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables de Supabase. Definí NEXT_PUBLIC_SUPABASE_URL y " +
        "SUPABASE_SERVICE_ROLE_KEY en .env.local (Settings > API en tu proyecto)."
    );
  }

  cliente = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cliente;
}
