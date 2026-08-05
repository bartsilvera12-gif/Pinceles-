import { createClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/types/database.types";

/**
 * Devuelve el perfil admin activo del usuario autenticado, o null.
 * Se usa en el layout protegido y en las Server Actions para autorizar.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .schema("pinceles")
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return (data as AdminProfile | null) ?? null;
}

export function isSuperAdmin(admin: AdminProfile | null): boolean {
  return admin?.role === "super_admin";
}
