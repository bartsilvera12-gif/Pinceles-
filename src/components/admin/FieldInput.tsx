"use client";

import Image from "next/image";
import type { FieldDef } from "@/lib/admin/collections";

const inp: React.CSSProperties = { width: "100%", minHeight: 44, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };
const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 };

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const v = value ?? "";

  if (field.type === "boolean") {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }

  return (
    <label style={{ gridColumn: field.full ? "1 / -1" : undefined }}>
      <span style={lbl}>
        {field.label}
        {field.required && <span style={{ color: "#b23b2f" }}> *</span>}
      </span>

      {field.type === "textarea" ? (
        <textarea value={String(v)} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={field.placeholder} style={{ ...inp, resize: "vertical" }} />
      ) : field.type === "select" ? (
        <select value={String(v)} onChange={(e) => onChange(e.target.value)} style={inp}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : field.type === "color" ? (
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="color" value={String(v) || "#000000"} onChange={(e) => onChange(e.target.value)} style={{ width: 46, height: 44, border: "1px solid rgba(5,5,5,.16)", borderRadius: 10, background: "#fff", cursor: "pointer" }} />
          <input type="text" value={String(v)} onChange={(e) => onChange(e.target.value)} placeholder="#D9912F" style={inp} />
        </span>
      ) : field.type === "image" ? (
        <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {String(v) && (
            <span style={{ position: "relative", width: 56, height: 42, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#eee" }}>
              <Image src={String(v)} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
            </span>
          )}
          <input type="text" value={String(v)} onChange={(e) => onChange(e.target.value)} placeholder="/images/archivo.jpeg o URL" style={inp} />
        </span>
      ) : (
        <input
          type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
          value={String(v)}
          onChange={(e) => onChange(field.type === "number" ? e.target.value : e.target.value)}
          placeholder={field.placeholder}
          style={inp}
        />
      )}
      {field.help && <span style={{ display: "block", marginTop: 5, fontSize: 12, color: "#8a8a8a" }}>{field.help}</span>}
    </label>
  );
}
