"use client";

import { useEffect, useState } from "react";
import { SpaPage } from "@/components/admin/spa/SpaPage";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { getSupabase } from "@/lib/admin/spa";

type AuditRow = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  admin_id: string | null;
};

export default function AuditoriaAdminPage() {
  const { admin } = useAuth();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const isSuper = admin?.role === "super_admin";

  useEffect(() => {
    if (!isSuper) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await getSupabase()
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, created_at, admin_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (active) {
        setRows(((data as AuditRow[] | null) ?? []));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isSuper]);

  return (
    <SpaPage title="Auditoría" subtitle="Registro de acciones administrativas (solo lectura).">
      {!isSuper ? (
        <p style={{ color: "#8a8a8a" }}>Esta sección requiere permisos de super administrador.</p>
      ) : loading ? (
        <p style={{ color: "#8a8a8a" }}>Cargando…</p>
      ) : (
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
      )}
    </SpaPage>
  );
}
