import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * VERSIÓN ESTÁTICA (Hostinger / `output: export`).
 *
 * Cliente de Supabase ANÓNIMO y SIN cookies. El sitio se genera como HTML
 * estático en tiempo de build: no hay request, sesión ni servidor, por lo que
 * `next/headers` → `cookies()` no está disponible. El contenido público se lee
 * vía RLS (lo mismo que ve un visitante no logueado) y queda "horneado" en el
 * HTML. Para reflejar cambios de contenido hay que reconstruir y volver a subir.
 *
 * (En la rama `main` este archivo usa `@supabase/ssr` con cookies para el panel
 * admin. Acá se reemplaza porque el hosting estático no ejecuta Node.)
 */
export async function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: "pinceles" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
