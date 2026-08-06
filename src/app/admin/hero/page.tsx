"use client";

import { useEffect, useState } from "react";
import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { FieldInput } from "@/components/admin/FieldInput";
import { SINGLETONS } from "@/lib/admin/collections";
import { getSupabase, coerceValues } from "@/lib/admin/spa";

const KEY = "hero_content";

export default function HeroAdminPage() {
  return (
    <AdminSpaShell>
      <HeroEditor />
    </AdminSpaShell>
  );
}

function HeroEditor() {
  const config = SINGLETONS[KEY]!;
  const { admin } = useAuth();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Carga inicial del registro Hero desde Supabase.
  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.from(config.table).select("*").limit(1).maybeSingle();
      if (!active) return;
      const row = (data as Record<string, unknown> | null) ?? null;
      const base: Record<string, unknown> = {};
      for (const f of config.fields) base[f.name] = row?.[f.name] ?? (f.type === "boolean" ? false : "");
      setValues(base);
      setRowId((row?.id as string | undefined) ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [config]);

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  const onSave = async () => {
    setSaving(true);
    setStatus(null);
    const { data, error: coerceErr } = coerceValues(config.fields, values);
    if (coerceErr) {
      setStatus({ ok: false, msg: coerceErr });
      setSaving(false);
      return;
    }
    if (admin?.id) data.updated_by = admin.id;

    const supabase = getSupabase();
    const t = supabase.from(config.table);

    // Upsert de fila única (igual criterio que el admin dinámico).
    const { data: existing } = await t.select("id").limit(1).maybeSingle();
    const targetId = (existing?.id as string | undefined) ?? rowId;
    const { error } = targetId
      ? await t.update(data).eq("id", targetId)
      : await t.insert(data);

    setSaving(false);
    if (error) {
      setStatus({ ok: false, msg: "No se pudo guardar. " + (error.message ?? "") });
      return;
    }
    setStatus({ ok: true, msg: "Guardado. Los cambios ya están en vivo." });
  };

  if (loading) {
    return <p style={{ fontSize: 15, color: "#8a8a8a" }}>Cargando contenido…</p>;
  }

  return (
    <div>
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,34px)", fontWeight: 700 }}>{config.title}</h1>
      <p style={{ margin: "8px 0 24px", fontSize: 15, color: "#4D4D4E" }}>{config.subtitle}</p>

      <div style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: 22, maxWidth: 760 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {config.fields.map((f) => (
            <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, marginTop: 20 }}>
          {status && (
            <span style={{ fontSize: 13, fontWeight: 600, color: status.ok ? "#2f7d4d" : "#b23b2f" }}>{status.msg}</span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            style={{ padding: "12px 26px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
