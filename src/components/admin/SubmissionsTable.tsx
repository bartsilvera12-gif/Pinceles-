"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSubmissionStatusAction, updateSubmissionNotesAction } from "@/lib/actions/admin/submissions";
import { whatsappUrl } from "@/lib/utils";
import type { ContactSubmission, LeadStatus } from "@/types/database.types";

const STATUSES: LeadStatus[] = ["nuevo", "contactado", "cotizado", "aprobado", "cerrado", "descartado"];
const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };

export function SubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const list = useMemo(
    () =>
      submissions.filter((s) => {
        if (status && s.status !== status) return false;
        if (q) {
          const hay = `${s.name} ${s.company ?? ""} ${s.phone} ${s.email ?? ""} ${s.location ?? ""}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [submissions, q, status]
  );

  const changeStatus = (id: string, next: LeadStatus) =>
    startTransition(async () => {
      const res = await updateSubmissionStatusAction(id, next);
      if (res.ok) {
        toast.success("Estado actualizado.");
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });

  const saveNotes = (id: string) =>
    startTransition(async () => {
      const res = await updateSubmissionNotesAction(id, noteDraft);
      if (res.ok) {
        toast.success("Notas guardadas.");
        setOpenId(null);
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });

  const exportCsv = () => {
    const headers = ["Fecha", "Nombre", "Empresa", "Teléfono", "Correo", "Servicio", "Ubicación", "Estado", "Mensaje"];
    const rows = list.map((s) => [
      new Date(s.created_at).toLocaleString("es-PY"),
      s.name,
      s.company ?? "",
      s.phone,
      s.email ?? "",
      s.service_name_snapshot ?? "",
      s.location ?? "",
      s.status,
      (s.message ?? "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solicitudes-pinceles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inp, flex: "1 1 220px" }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={inp}>
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="button" onClick={exportCsv} style={{ ...inp, cursor: "pointer", fontWeight: 700 }}>
          Exportar CSV
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: pending ? 0.6 : 1 }}>
        {list.length === 0 && <p style={{ color: "#8a8a8a" }}>No hay solicitudes.</p>}
        {list.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{s.name}{s.company ? ` · ${s.company}` : ""}</p>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "#4D4D4E" }}>
                  {s.phone}{s.email ? ` · ${s.email}` : ""}{s.location ? ` · ${s.location}` : ""}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#8a8a8a" }}>
                  {new Date(s.created_at).toLocaleString("es-PY")}{s.service_name_snapshot ? ` · ${s.service_name_snapshot}` : ""}
                </p>
              </div>
              <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value as LeadStatus)} disabled={pending} style={inp}>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <a href={whatsappUrl(s.phone)} target="_blank" rel="noopener" style={{ ...inp, display: "inline-flex", alignItems: "center", fontWeight: 700, color: "#050505" }}>
                WhatsApp
              </a>
              <button type="button" onClick={() => { setOpenId(openId === s.id ? null : s.id); setNoteDraft(s.internal_notes ?? ""); }} style={{ ...inp, cursor: "pointer", fontWeight: 600 }}>
                Notas
              </button>
            </div>
            {s.message && <p style={{ margin: "10px 0 0", fontSize: 14, color: "#333", background: "#F8F6F1", borderRadius: 10, padding: "10px 12px" }}>{s.message}</p>}
            {openId === s.id && (
              <div style={{ marginTop: 10 }}>
                <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={3} placeholder="Notas internas (no visibles en el sitio)" style={{ ...inp, width: "100%", resize: "vertical" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button type="button" onClick={() => saveNotes(s.id)} disabled={pending} style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: "pointer" }}>
                    Guardar notas
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
