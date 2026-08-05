import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Cliente de Supabase para el navegador (componentes cliente).
 * Usa la anon key (pública) — el acceso lo controla RLS.
 * El schema por defecto es `pinceles`.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: "pinceles" },
  });
}
