import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Registra una acción en pinceles.audit_logs (usa service_role para que el
 * insert nunca sea bloqueado por RLS). No lanza si falla: la auditoría no debe
 * romper la operación principal.
 */
export async function auditLog(params: {
  adminId: string | null;
  action: string;
  entityType?: string;
  entityId?: string | null;
  oldData?: unknown;
  newData?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.schema("pinceles").from("audit_logs").insert({
      admin_id: params.adminId,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      old_data: params.oldData ?? null,
      new_data: params.newData ?? null,
      ip_address: params.ip ?? null,
      user_agent: params.userAgent ?? null,
    });
  } catch {
    // Silencioso a propósito.
  }
}
