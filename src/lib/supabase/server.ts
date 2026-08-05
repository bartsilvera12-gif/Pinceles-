import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Cliente de Supabase para Server Components / Route Handlers / Server Actions.
 * Lee y refresca la sesión desde cookies. Schema por defecto: `pinceles`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      db: { schema: "pinceles" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component sin respuesta mutable: se ignora.
            // El middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
