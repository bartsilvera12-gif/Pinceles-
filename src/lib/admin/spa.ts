import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

/**
 * Cliente Supabase para el PANEL ADMIN client-side (estilo SPA, para hosting
 * estático tipo Hostinger). La sesión se guarda en localStorage del navegador,
 * no en cookies de servidor. El acceso lo controla RLS: las mismas políticas
 * que ya usa el admin dinámico permiten al usuario autenticado leer/escribir.
 *
 * Singleton: una sola instancia por pestaña para compartir la sesión.
 */
function makeClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: "pinceles" },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "pinceles-admin-auth",
    },
  });
}

let _client: ReturnType<typeof makeClient> | null = null;

export function getSupabase() {
  if (!_client) _client = makeClient();
  return _client;
}

export type AdminProfile = {
  id: string;
  role: string;
  is_active: boolean;
  full_name: string | null;
  email: string | null;
};

/** Coerción mínima de valores de formulario (espejo del server, sin service-role). */
export function coerceValues(
  fields: { name: string; type: string; required?: boolean; label: string }[],
  values: Record<string, unknown>
): { data: Record<string, unknown>; error?: string } {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "boolean") {
      out[f.name] = raw === true || raw === "true" || raw === "on";
      continue;
    }
    if (f.type === "number") {
      if (raw === "" || raw === null || raw === undefined) out[f.name] = null;
      else {
        const n = Number(raw);
        if (Number.isNaN(n)) return { data: {}, error: `El campo "${f.label}" debe ser numérico.` };
        out[f.name] = n;
      }
      continue;
    }
    const s = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw);
    if (f.required && !s) return { data: {}, error: `El campo "${f.label}" es obligatorio.` };
    out[f.name] = s === "" ? null : s;
  }
  return { data: out };
}
