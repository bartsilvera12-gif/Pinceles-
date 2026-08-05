"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { auditLog } from "@/lib/audit/log";
import { COLLECTIONS, SINGLETONS, type FieldDef } from "@/lib/admin/collections";

export type ActionResult = { ok: boolean; id?: string; error?: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function coerce(fields: FieldDef[], values: Record<string, unknown>): { data: Record<string, unknown>; error?: string } {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "boolean") {
      out[f.name] = raw === true || raw === "true" || raw === "on";
      continue;
    }
    if (f.type === "number") {
      if (raw === "" || raw === null || raw === undefined) {
        out[f.name] = null;
      } else {
        const n = Number(raw);
        if (Number.isNaN(n)) return { data: {}, error: `El campo "${f.label}" debe ser numérico.` };
        out[f.name] = n;
      }
      continue;
    }
    const s = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw);
    if (f.required && !s) return { data: {}, error: `El campo "${f.label}" es obligatorio.` };
    if (f.type === "slug" && s && !SLUG_RE.test(s)) return { data: {}, error: `"${f.label}": solo minúsculas, números y guiones.` };
    out[f.name] = s === "" ? null : s;
  }
  return { data: out };
}

export async function upsertCollectionItemAction(
  collectionKey: string,
  id: string | null,
  values: Record<string, unknown>
): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const config = COLLECTIONS[collectionKey];
  if (!config) return { ok: false, error: "Colección inválida." };

  const { data, error: coerceErr } = coerce(config.fields, values);
  if (coerceErr) return { ok: false, error: coerceErr };

  if (config.hasVisible && typeof values.is_visible !== "undefined") {
    data.is_visible = values.is_visible === true || values.is_visible === "true" || values.is_visible === "on";
  }

  const supabase = await createClient();
  const t = () => supabase.schema("pinceles").from(config.table);

  if (id) {
    const { error } = await t().update(data).eq("id", id);
    if (error) return { ok: false, error: dbError(error) };
    await auditLog({ adminId: admin.id, action: "update", entityType: config.table, entityId: id, newData: data });
    revalidatePath("/");
    return { ok: true, id };
  }

  // Nuevo: sort_order al final
  if (config.orderable) {
    const { data: maxRow } = await t().select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const max = (maxRow as { sort_order: number } | null)?.sort_order ?? 0;
    data.sort_order = max + 1;
  }
  const { data: inserted, error } = await t().insert(data).select("id").single();
  if (error || !inserted) return { ok: false, error: dbError(error) };
  await auditLog({ adminId: admin.id, action: "create", entityType: config.table, entityId: inserted.id, newData: data });
  revalidatePath("/");
  return { ok: true, id: inserted.id };
}

export async function deleteCollectionItemAction(collectionKey: string, id: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const config = COLLECTIONS[collectionKey];
  if (!config) return { ok: false, error: "Colección inválida." };

  const supabase = await createClient();
  const { error } = await supabase.schema("pinceles").from(config.table).delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar." };
  await auditLog({ adminId: admin.id, action: "delete", entityType: config.table, entityId: id });
  revalidatePath("/");
  return { ok: true };
}

export async function toggleCollectionVisibleAction(collectionKey: string, id: string, visible: boolean): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const config = COLLECTIONS[collectionKey];
  if (!config || !config.hasVisible) return { ok: false, error: "Colección inválida." };

  const supabase = await createClient();
  const { error } = await supabase.schema("pinceles").from(config.table).update({ is_visible: visible }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar." };
  await auditLog({ adminId: admin.id, action: "update", entityType: config.table, entityId: id, newData: { is_visible: visible } });
  revalidatePath("/");
  return { ok: true };
}

export async function reorderCollectionAction(collectionKey: string, orderedIds: string[]): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const config = COLLECTIONS[collectionKey];
  if (!config || !config.orderable) return { ok: false, error: "Colección inválida." };

  const supabase = await createClient();
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.schema("pinceles").from(config.table).update({ sort_order: i + 1 }).eq("id", orderedIds[i]!);
  }
  revalidatePath("/");
  return { ok: true };
}

export async function saveSingletonAction(singletonKey: string, values: Record<string, unknown>): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const config = SINGLETONS[singletonKey];
  if (!config) return { ok: false, error: "Configuración inválida." };
  if (config.superOnly && admin.role !== "super_admin") return { ok: false, error: "Requiere super administrador." };

  const { data, error: coerceErr } = coerce(config.fields, values);
  if (coerceErr) return { ok: false, error: coerceErr };
  data.updated_by = admin.id;

  const supabase = await createClient();
  const t = () => supabase.schema("pinceles").from(config.table);

  const { data: existing } = await t().select("id").limit(1).maybeSingle();
  if (existing?.id) {
    const { error } = await t().update(data).eq("id", existing.id);
    if (error) return { ok: false, error: dbError(error) };
  } else {
    const { error } = await t().insert(data);
    if (error) return { ok: false, error: dbError(error) };
  }
  await auditLog({ adminId: admin.id, action: "update", entityType: config.table, newData: data });
  revalidatePath("/");
  return { ok: true };
}

function dbError(error: { code?: string } | null): string {
  if (error?.code === "23505") return "Ya existe un registro con ese valor único (slug).";
  return "No se pudo guardar. Revisá los datos.";
}
