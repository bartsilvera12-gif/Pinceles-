import { getSupabase } from "@/lib/admin/spa";
import { COLLECTIONS, SINGLETONS, type FieldDef } from "@/lib/admin/collections";

/**
 * Capa de datos del panel admin CLIENT-SIDE. Espeja las Server Actions del
 * admin dinámico (src/lib/actions/admin/collections.ts) pero usando el cliente
 * Supabase del navegador con la sesión del usuario. La autorización la aplica
 * RLS (mismas políticas). Sin auditoría ni revalidate (eso era del servidor).
 */

export type Row = Record<string, unknown> & { id: string; is_visible?: boolean };
export type Result = { ok: boolean; id?: string; error?: string };

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
    if (f.type === "slug" && s && !SLUG_RE.test(s)) return { data: {}, error: `"${f.label}": solo minúsculas, números y guiones.` };
    out[f.name] = s === "" ? null : s;
  }
  return { data: out };
}

function dbError(error: { code?: string; message?: string } | null): string {
  if (error?.code === "23505") return "Ya existe un registro con ese valor único (slug).";
  return "No se pudo guardar. " + (error?.message ?? "Revisá los datos.");
}

// ── Singletons ────────────────────────────────────────────────────────────────
export async function readSingleton(key: string): Promise<Record<string, unknown> | null> {
  const cfg = SINGLETONS[key];
  if (!cfg) return null;
  const { data } = await getSupabase().from(cfg.table).select("*").limit(1).maybeSingle();
  return (data as Record<string, unknown> | null) ?? null;
}

export async function saveSingleton(key: string, values: Record<string, unknown>, adminId?: string): Promise<Result> {
  const cfg = SINGLETONS[key];
  if (!cfg) return { ok: false, error: "Configuración inválida." };
  const { data, error: cErr } = coerce(cfg.fields, values);
  if (cErr) return { ok: false, error: cErr };
  if (adminId) data.updated_by = adminId;

  const t = getSupabase().from(cfg.table);
  const { data: existing } = await t.select("id").limit(1).maybeSingle();
  const { error } = existing?.id
    ? await t.update(data).eq("id", existing.id as string)
    : await t.insert(data);
  if (error) return { ok: false, error: dbError(error) };
  return { ok: true };
}

// ── Colecciones ───────────────────────────────────────────────────────────────
export async function readCollection(key: string): Promise<Row[]> {
  const cfg = COLLECTIONS[key];
  if (!cfg) return [];
  const base = getSupabase().from(cfg.table).select("*");
  const { data } = await (cfg.orderable ? base.order("sort_order") : base.order("created_at"));
  return ((data as Row[] | null) ?? []);
}

export async function upsertCollectionItem(key: string, id: string | null, values: Record<string, unknown>): Promise<Result> {
  const cfg = COLLECTIONS[key];
  if (!cfg) return { ok: false, error: "Colección inválida." };
  const { data, error: cErr } = coerce(cfg.fields, values);
  if (cErr) return { ok: false, error: cErr };
  if (cfg.hasVisible && typeof values.is_visible !== "undefined") {
    data.is_visible = values.is_visible === true || values.is_visible === "true" || values.is_visible === "on";
  }

  const t = () => getSupabase().from(cfg.table);
  if (id) {
    const { error } = await t().update(data).eq("id", id);
    if (error) return { ok: false, error: dbError(error) };
    return { ok: true, id };
  }
  if (cfg.orderable) {
    const { data: maxRow } = await t().select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const max = (maxRow as { sort_order: number } | null)?.sort_order ?? 0;
    data.sort_order = max + 1;
  }
  const { data: inserted, error } = await t().insert(data).select("id").single();
  if (error || !inserted) return { ok: false, error: dbError(error) };
  return { ok: true, id: (inserted as { id: string }).id };
}

export async function deleteCollectionItem(key: string, id: string): Promise<Result> {
  const cfg = COLLECTIONS[key];
  if (!cfg) return { ok: false, error: "Colección inválida." };
  const { error } = await getSupabase().from(cfg.table).delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar." };
  return { ok: true };
}

export async function toggleCollectionVisible(key: string, id: string, visible: boolean): Promise<Result> {
  const cfg = COLLECTIONS[key];
  if (!cfg || !cfg.hasVisible) return { ok: false, error: "Colección inválida." };
  const { error } = await getSupabase().from(cfg.table).update({ is_visible: visible }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar." };
  return { ok: true };
}

export async function reorderCollection(key: string, orderedIds: string[]): Promise<Result> {
  const cfg = COLLECTIONS[key];
  if (!cfg || !cfg.orderable) return { ok: false, error: "Colección inválida." };
  for (let i = 0; i < orderedIds.length; i++) {
    await getSupabase().from(cfg.table).update({ sort_order: i + 1 }).eq("id", orderedIds[i]!);
  }
  return { ok: true };
}
