"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";

export type ActionResult = { ok: boolean; error?: string };
export type GalleryInput = {
  media_type: "image" | "video";
  url: string;
  is_embed: boolean;
  poster_url?: string | null;
  title?: string | null;
  is_visible?: boolean;
};

function bump() {
  revalidatePath("/");
  revalidatePath("/admin/galeria");
}

export async function createGalleryItem(input: GalleryInput): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  if (!input.url?.trim()) return { ok: false, error: "Falta la URL o el archivo." };

  const sb = await createClient();
  const { data: last } = await sb
    .schema("pinceles")
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort = (((last?.sort_order as number | undefined) ?? -1) + 1) | 0;

  const { error } = await sb.schema("pinceles").from("gallery_items").insert({
    media_type: input.media_type,
    url: input.url.trim(),
    is_embed: !!input.is_embed,
    poster_url: input.poster_url || null,
    title: input.title || null,
    is_visible: input.is_visible ?? true,
    sort_order: sort,
  });
  if (error) return { ok: false, error: "No se pudo guardar el elemento." };
  bump();
  return { ok: true };
}

export async function updateGalleryItem(
  id: string,
  patch: { title?: string | null; is_visible?: boolean }
): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const sb = await createClient();
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title || null;
  if (patch.is_visible !== undefined) row.is_visible = patch.is_visible;
  const { error } = await sb.schema("pinceles").from("gallery_items").update(row).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar." };
  bump();
  return { ok: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const sb = await createClient();
  const { error } = await sb.schema("pinceles").from("gallery_items").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar." };
  bump();
  return { ok: true };
}

export async function setIntroVideo(url: string, isEmbed: boolean): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const sb = await createClient();
  const { data: s } = await sb.schema("pinceles").from("site_settings").select("id").limit(1).maybeSingle();
  if (!s) return { ok: false, error: "No hay configuración del sitio." };
  const { error } = await sb
    .schema("pinceles")
    .from("site_settings")
    .update({ intro_video_url: url.trim() || null, intro_video_is_embed: !!isEmbed })
    .eq("id", (s as { id: string }).id);
  if (error) return { ok: false, error: "No se pudo guardar el video." };
  bump();
  return { ok: true };
}

export async function reorderGallery(ids: string[]): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const sb = await createClient();
  await Promise.all(
    ids.map((id, i) => sb.schema("pinceles").from("gallery_items").update({ sort_order: i }).eq("id", id))
  );
  bump();
  return { ok: true };
}
