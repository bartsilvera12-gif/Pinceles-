import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente administrativo con service_role. SALTEA RLS.
 * SOLO puede usarse en código que corre exclusivamente en el servidor
 * (Route Handlers, Server Actions). Nunca en componentes cliente.
 * El import "server-only" hace fallar el build si se importa desde el navegador.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada.");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: "pinceles" },
  });
}
