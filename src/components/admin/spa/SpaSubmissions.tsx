"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/lib/admin/spa";
import { whatsappUrl } from "@/lib/utils";

const STATUSES = ["nuevo", "contactado", "cotizado", "aprobado", "cerrado", "descartado"] as const;
type LeadStatus = (typeof STATUSES)[number];

type Submission = {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  location: string | null;
  service_name_snapshot: string | null;
  status: LeadStatus;
  message: string | null;
  internal_notes: string | null;
  created_at: string;
};

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };

export function SpaSubmissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const reload = useCallback(async () => {
    const { data } = await getSupabase()
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(((data as Submission[] | null) ?? []));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const list = useMemo(
    () =>
      rows.filter((s) => {
        if (status && s.status !== status) return false;
        if (q) {
          const hay = `${s.name} ${s.company ?? ""} ${s.phone} ${s.email ?? ""} ${s.location ?? ""}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [rows, q, status]
  );

  const changeStatus = async (id: string, next: LeadStatus) => {
    setBusy(true);
    const patch: Record<string, unknown> = { status: next };
    if (next === "contactado") patch.contacted_at = new Date().toISOString();
    const { error } = await getSupabase().from("contact_submissions").update(patch).eq("id", id);
    setBusy(false);
    if (error) toast.error("No se pudo actualizar.");
    else {
      toast.success("Estado actualizado.");
      reload();
    }
  };

  const saveNotes = async (id: string) => {
    setBusy(true);
    const { error } = await getSupabase().from("contact_submissions").update({ internal_notes: noteDraft || null }).eq("id", id);
    setBusy(false);
    if (error) toast.error("No se pudieron guardar las notas.");
    else {
      toast.success("Notas guardadas.");
      setOpenId(null);
      reload();
    }
  };

  const exportCsv = () => {
    const headers = ["Fecha", "Nombre", "Empresa", "Teléfono", "Correo", "Servicio", "Ubicación", "Estado", "Mensaje"];
    const data = list.map((s) => [
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
    const csv = [headers, ...data].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solicitudes-pinceles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p style={{ color: "#8a8a8a" }}>Cargando solicitudes…</p>;

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
        <button type="button" onClick={exportCsv} style={{ ...inp, cursor: "pointer", fontWeight: 700 }}>Exportar CSV</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: busy ? 0.6 : 1 }}>
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
              <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value as LeadStatus)} disabled={busy} style={inp}>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <a href={whatsappUrl(s.phone)} target="_blank" rel="noopener" style={{ ...inp, display: "inline-flex", alignItems: "center", fontWeight: 700, color: "#050505" }}>WhatsApp</a>
              <button type="button" onClick={() => { setOpenId(openId === s.id ? null : s.id); setNoteDraft(s.internal_notes ?? ""); }} style={{ ...inp, cursor: "pointer", fontWeight: 600 }}>Notas</button>
            </div>
            {s.message && <p style={{ margin: "10px 0 0", fontSize: 14, color: "#333", background: "#F8F6F1", borderRadius: 10, padding: "10px 12px" }}>{s.message}</p>}
            {openId === s.id && (
              <div style={{ marginTop: 10 }}>
                <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={3} placeholder="Notas internas (no visibles en el sitio)" style={{ ...inp, width: "100%", resize: "vertical" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button type="button" onClick={() => saveNotes(s.id)} disabled={busy} style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: "pointer" }}>Guardar notas</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
