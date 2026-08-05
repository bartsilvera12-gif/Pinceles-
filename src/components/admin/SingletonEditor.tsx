"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldInput } from "@/components/admin/FieldInput";
import { saveSingletonAction } from "@/lib/actions/admin/collections";
import { SINGLETONS } from "@/lib/admin/collections";

export function SingletonEditor({
  singletonKey,
  initial,
}: {
  singletonKey: string;
  initial: Record<string, unknown> | null;
}) {
  const config = SINGLETONS[singletonKey];
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = {};
    for (const f of config?.fields ?? []) base[f.name] = initial?.[f.name] ?? (f.type === "boolean" ? false : "");
    return base;
  });
  const [saving, setSaving] = useState(false);

  if (!config) return <p>Configuración inválida.</p>;

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  const onSave = async () => {
    setSaving(true);
    const res = await saveSingletonAction(singletonKey, values);
    setSaving(false);
    if (res.ok) {
      toast.success("Guardado.");
      router.refresh();
    } else toast.error(res.error ?? "No se pudo guardar.");
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
