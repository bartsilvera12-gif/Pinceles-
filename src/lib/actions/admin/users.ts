"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { auditLog } from "@/lib/audit/log";
import type { AdminRole } from "@/types/database.types";

export type ActionResult = { ok: boolean; error?: string };

export async function createAdminUserAction(input: {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}): Promise<ActionResult> {
  const me = await getCurrentAdmin();
  if (!me || me.role !== "super_admin") return { ok: false, error: "Requiere super administrador." };

  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || input.password.length < 8) {
    return { ok: false, error: "Correo válido y contraseña de al menos 8 caracteres." };
  }
  if (input.role !== "super_admin" && input.role !== "editor") return { ok: false, error: "Rol inválido." };

  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  });
  if (error || !created.user) return { ok: false, error: "No se pudo crear el usuario (¿ya existe?)." };

  const { error: pErr } = await admin.schema("pinceles").from("admin_profiles").upsert(
    { id: created.user.id, email, full_name: input.fullName || email, role: input.role, is_active: true },
    { onConflict: "id" }
  );
  if (pErr) return { ok: false, error: "Usuario creado pero falló el perfil." };

  await auditLog({ adminId: me.id, action: "create", entityType: "admin_profile", entityId: created.user.id, newData: { email, role: input.role } });
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function updateAdminAction(id: string, patch: { role?: AdminRole; is_active?: boolean }): Promise<ActionResult> {
  const me = await getCurrentAdmin();
  if (!me || me.role !== "super_admin") return { ok: false, error: "Requiere super administrador." };
  if (id === me.id) return { ok: false, error: "No podés cambiar tu propio rol o estado." };

  const admin = createAdminClient();
  const { error } = await admin.schema("pinceles").from("admin_profiles").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message.includes("último super_admin") ? "No se puede desactivar el último super administrador." : "No se pudo actualizar." };

  await auditLog({ adminId: me.id, action: "update", entityType: "admin_profile", entityId: id, newData: patch });
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function deleteAdminAction(id: string): Promise<ActionResult> {
  const me = await getCurrentAdmin();
  if (!me || me.role !== "super_admin") return { ok: false, error: "Requiere super administrador." };
  if (id === me.id) return { ok: false, error: "No podés eliminar tu propia cuenta." };

  const admin = createAdminClient();
  // Borrar el usuario de Auth elimina el perfil por FK on delete cascade.
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: "No se pudo eliminar (¿es el último super admin?)." };

  await auditLog({ adminId: me.id, action: "delete", entityType: "admin_profile", entityId: id });
  revalidatePath("/admin/usuarios");
  return { ok: true };
}
