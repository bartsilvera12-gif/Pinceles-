import { redirect } from "next/navigation";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/auth/get-admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

interface AuditRow {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  admin_id: string | null;
}

export default async function Page() {
  const admin = await getCurrentAdmin();
  if (!isSuperAdmin(admin)) redirect("/admin");

  const supabase = await createClient();
  const { data } = await supabase
    .schema("pinceles")
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, created_at, admin_id")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data as AuditRow[] | null) ?? [];

  return (
    <div>
      <PageHeader title="Auditoría" subtitle="Registro de acciones administrativas (solo lectura)." />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.length === 0 && <p style={{ color: "#8a8a8a" }}>Sin registros aún.</p>}
        {rows.map((r) => (
          <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#D9912F", minWidth: 90 }}>{r.action}</span>
            <span style={{ color: "#4D4D4E" }}>{r.entity_type ?? ""}{r.entity_id ? ` · ${r.entity_id.slice(0, 8)}` : ""}</span>
            <span style={{ marginLeft: "auto", color: "#8a8a8a" }}>{new Date(r.created_at).toLocaleString("es-PY")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
