"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { auditLog } from "@/lib/audit/log";

export type AuthState = { error: string | null };

/**
 * Inicia sesión con email + contraseña. Valida que exista un perfil admin
 * activo; si no, cierra la sesión y niega el acceso. Mensajes de error
 * genéricos (no revelan si el email existe).
 */
export async function signInAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  if (!email || !password) return { error: "Ingresá tu correo y contraseña." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Credenciales inválidas." };
  }

  // Validar perfil admin activo
  const { data: profile } = await supabase
    .schema("pinceles")
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene acceso al panel." };
  }

  // Actualizar last_login (service_role) + auditar
  try {
    const admin = createAdminClient();
    await admin
      .schema("pinceles")
      .from("admin_profiles")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);
  } catch {
    /* no crítico */
  }
  await auditLog({ adminId: data.user.id, action: "login", entityType: "auth" });

  const safe = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safe);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  if (user) await auditLog({ adminId: user.id, action: "logout", entityType: "auth" });
  redirect("/admin/login");
}

/**
 * Envía un correo de recuperación de contraseña.
 */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Ingresá tu correo." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/restablecer-contrasena`,
  });
  // Respuesta siempre igual (no revela si el email existe).
  return { error: null };
}

/**
 * Establece una nueva contraseña (con sesión de recuperación activa).
 */
export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "No se pudo actualizar la contraseña. Pedí un nuevo enlace." };
  redirect("/admin");
}
