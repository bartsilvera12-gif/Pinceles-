"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FieldInput } from "@/components/admin/FieldInput";
import { SINGLETONS } from "@/lib/admin/collections";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { readSingleton, saveSingleton } from "@/lib/admin/spa-data";

export function SpaSingletonEditor({ singletonKey }: { singletonKey: string }) {
  const config = SINGLETONS[singletonKey];
  const { admin } = useAuth();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;
    let active = true;
    (async () => {
      const row = await readSingleton(singletonKey);
      if (!active) return;
      const base: Record<string, unknown> = {};
      for (const f of config.fields) base[f.name] = row?.[f.name] ?? (f.type === "boolean" ? false : "");
      setValues(base);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [singletonKey, config]);

  if (!config) return <p>Configuración inválida.</p>;
  if (config.superOnly && admin?.role !== "super_admin") {
    return <p style={{ color: "#8a8a8a" }}>Esta sección requiere permisos de super administrador.</p>;
  }
  if (loading) return <p style={{ color: "#8a8a8a" }}>Cargando…</p>;

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  const onSave = async () => {
    setSaving(true);
    const res = await saveSingleton(singletonKey, values, admin?.id);
    setSaving(false);
    if (res.ok) toast.success("Guardado. Los cambios ya están en vivo.");
    else toast.error(res.error ?? "No se pudo guardar.");
  };

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: 22, maxWidth: 760 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {config.fields.map((f) => (
          <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button type="button" onClick={onSave} disabled={saving} style={{ padding: "12px 26px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
