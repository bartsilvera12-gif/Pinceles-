"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { auditLog } from "@/lib/audit/log";

export type ActionResult = { ok: boolean; error?: string };

export async function deleteMediaAction(id: string, storagePath: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const supabase = await createClient();
  await supabase.storage.from("pinceles-media").remove([storagePath]);
  const { error } = await supabase.schema("pinceles").from("media_assets").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar el registro." };

  await auditLog({ adminId: admin.id, action: "delete", entityType: "media_asset", entityId: id });
  revalidatePath("/admin/multimedia");
  return { ok: true };
}

export async function updateMediaAltAction(id: string, alt: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  const supabase = await createClient();
  const { error } = await supabase.schema("pinceles").from("media_assets").update({ alt_text: alt || null }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar." };
  revalidatePath("/admin/multimedia");
  return { ok: true };
}
