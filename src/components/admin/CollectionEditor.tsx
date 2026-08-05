"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import { COLLECTIONS } from "@/lib/admin/collections";
import {
  upsertCollectionItemAction,
  deleteCollectionItemAction,
  toggleCollectionVisibleAction,
  reorderCollectionAction,
} from "@/lib/actions/admin/collections";

type Row = Record<string, unknown> & { id: string; is_visible?: boolean };

export function CollectionEditor({ collectionKey, rows }: { collectionKey: string; rows: Row[] }) {
  const config = COLLECTIONS[collectionKey];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(null);

  if (!config) return <p>Colección inválida.</p>;

  const refresh = () => router.refresh();

  const openNew = () => {
    const values: Record<string, unknown> = {};
    for (const f of config.fields) values[f.name] = f.type === "boolean" ? false : "";
    if (config.hasVisible) values.is_visible = true;
    setEditing({ id: null, values });
  };
  const openEdit = (row: Row) => {
    const values: Record<string, unknown> = {};
    for (const f of config.fields) values[f.name] = row[f.name] ?? (f.type === "boolean" ? false : "");
    if (config.hasVisible) values.is_visible = row.is_visible ?? true;
    setEditing({ id: row.id, values });
  };

  const save = () => {
    if (!editing) return;
    startTransition(async () => {
      const res = await upsertCollectionItemAction(collectionKey, editing.id, editing.values);
      if (res.ok) {
        toast.success("Guardado.");
        setEditing(null);
        refresh();
      } else toast.error(res.error ?? "No se pudo guardar.");
    });
  };

  const remove = (row: Row) => {
    const title = String(row[config.listTitleField] ?? "este ítem");
    if (!confirm(`¿Eliminar “${title}”?`)) return;
    startTransition(async () => {
      const res = await deleteCollectionItemAction(collectionKey, row.id);
      if (res.ok) {
        toast.success("Eliminado.");
        refresh();
      } else toast.error(res.error ?? "No se pudo eliminar.");
    });
  };

  const toggle = (row: Row) => {
    startTransition(async () => {
      const res = await toggleCollectionVisibleAction(collectionKey, row.id, !(row.is_visible ?? true));
      if (res.ok) refresh();
      else toast.error(res.error ?? "Error.");
    });
  };

  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j]!, next[i]!];
    startTransition(async () => {
      const res = await reorderCollectionAction(collectionKey, next.map((r) => r.id));
      if (res.ok) refresh();
      else toast.error(res.error ?? "Error al reordenar.");
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button type="button" onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
          <Plus size={16} /> Agregar {config.singular}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: pending ? 0.6 : 1 }}>
        {rows.length === 0 && <p style={{ color: "#8a8a8a" }}>Sin registros. Agregá el primero.</p>}
        {rows.map((row, i) => {
          const visible = row.is_visible ?? true;
          return (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 12, padding: 12 }}>
              {config.imageField && (
                <div style={{ position: "relative", width: 56, height: 42, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#eee" }}>
                  {row[config.imageField] ? <Image src={String(row[config.imageField])} alt="" fill sizes="56px" style={{ objectFit: "cover" }} /> : null}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {String(row[config.listTitleField] ?? "—")}
                </p>
                {config.listSubtitleField && row[config.listSubtitleField] ? (
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#4D4D4E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {String(row[config.listSubtitleField])}
                  </p>
                ) : null}
              </div>
              {config.orderable && (
                <span style={{ display: "flex", gap: 4 }}>
                  <button type="button" title="Subir" onClick={() => move(i, -1)} disabled={pending} style={iconBtn}><ArrowUp size={15} /></button>
                  <button type="button" title="Bajar" onClick={() => move(i, 1)} disabled={pending} style={iconBtn}><ArrowDown size={15} /></button>
                </span>
              )}
              {config.hasVisible && (
                <button
                  type="button"
                  title={visible ? "Clic para ocultar" : "Clic para mostrar"}
                  onClick={() => toggle(row)}
                  disabled={pending}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: `1px solid ${visible ? "rgba(31,138,76,.35)" : "rgba(5,5,5,.16)"}`,
                    background: visible ? "rgba(31,138,76,.1)" : "#fff",
                    color: visible ? "#1f8a4c" : "#8a8a8a",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  {visible ? "Visible" : "Oculto"}
                </button>
              )}
              <button type="button" title="Editar" onClick={() => openEdit(row)} style={iconBtn}><Pencil size={15} /></button>
              <button type="button" title="Eliminar" onClick={() => remove(row)} disabled={pending} style={{ ...iconBtn, color: "#b23b2f" }}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,5,5,.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20, overflowY: "auto" }} onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 640, background: "#fff", borderRadius: 18, padding: 24, margin: "40px 0" }}>
            <h2 style={{ margin: "0 0 18px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>
              {editing.id ? "Editar" : "Nuevo"} {config.singular}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {config.fields.map((f) => (
                <FieldInput key={f.name} field={f} value={editing.values[f.name]} onChange={(v) => setEditing({ ...editing, values: { ...editing.values, [f.name]: v } })} />
              ))}
              {config.hasVisible && (
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
                  <input type="checkbox" checked={Boolean(editing.values.is_visible)} onChange={(e) => setEditing({ ...editing, values: { ...editing.values, is_visible: e.target.checked } })} />
                  Visible
                </label>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "11px 20px", borderRadius: 12, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button type="button" onClick={save} disabled={pending} style={{ padding: "11px 24px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  flexShrink: 0,
  borderRadius: 9,
  border: "1px solid rgba(5,5,5,.14)",
  background: "#fff",
  color: "#050505",
  cursor: "pointer",
};
