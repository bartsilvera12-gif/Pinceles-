"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { auditLog } from "@/lib/audit/log";
import type { LeadStatus } from "@/types/database.types";

export type ActionResult = { ok: boolean; error?: string };

const STATUSES: LeadStatus[] = ["nuevo", "contactado", "cotizado", "aprobado", "cerrado", "descartado"];

export async function updateSubmissionStatusAction(id: string, status: LeadStatus): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };
  if (!STATUSES.includes(status)) return { ok: false, error: "Estado inválido." };

  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "contactado") patch.contacted_at = new Date().toISOString();

  const { error } = await supabase.schema("pinceles").from("contact_submissions").update(patch).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar." };

  await auditLog({ adminId: admin.id, action: "update", entityType: "contact_submission", entityId: id, newData: { status } });
  revalidatePath("/admin/solicitudes");
  return { ok: true };
}

export async function updateSubmissionNotesAction(id: string, notes: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const supabase = await createClient();
  const { error } = await supabase
    .schema("pinceles")
    .from("contact_submissions")
    .update({ internal_notes: notes || null })
    .eq("id", id);
  if (error) return { ok: false, error: "No se pudieron guardar las notas." };

  await auditLog({ adminId: admin.id, action: "update", entityType: "contact_submission", entityId: id });
  revalidatePath("/admin/solicitudes");
  return { ok: true };
}
