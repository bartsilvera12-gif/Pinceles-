"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, ImageIcon } from "lucide-react";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { uploadImage } from "@/lib/admin/spa-upload";

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14, width: "100%" };

/** Campo de imagen: miniatura + input de URL + botón para subir un archivo. */
export function ImageUploadField({
  value,
  onChange,
  folder = "general",
  placeholder = "/images/archivo.jpeg o URL",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
}) {
  const { admin } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    const res = await uploadImage(file, folder, admin?.id);
    setBusy(false);
    if (res.ok && res.url) {
      onChange(res.url);
      toast.success("Imagen subida.");
    } else {
      toast.error(res.error ?? "No se pudo subir.");
    }
  };

  return (
    <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{ position: "relative", width: 56, height: 42, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#eee", display: "grid", placeItems: "center", color: "#b8b8b8" }}>
        {value ? <Image src={value} alt="" fill sizes="56px" style={{ objectFit: "cover" }} /> : <ImageIcon size={20} />}
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inp} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Subir desde tu computadora"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 13, fontWeight: 700, color: "#050505", cursor: busy ? "wait" : "pointer", whiteSpace: "nowrap" }}
      >
        {busy ? <Loader2 size={15} className="pz-spin" /> : <ImagePlus size={15} />}
        {busy ? "Subiendo…" : "Subir"}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onFile} style={{ display: "none" }} />
      <style>{`.pz-spin{animation:pzspin .8s linear infinite}@keyframes pzspin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}
