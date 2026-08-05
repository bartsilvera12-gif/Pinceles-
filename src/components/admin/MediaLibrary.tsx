"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, UploadCloud } from "lucide-react";
import { deleteMediaAction } from "@/lib/actions/admin/media";
import type { MediaAsset } from "@/types/database.types";

const FOLDERS = ["general", "hero", "about", "projects", "testimonials"];
const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");
  const [q, setQ] = useState("");

  const onUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.ok) ok++;
      else toast.error(json.error ?? `No se pudo subir ${file.name}`);
    }
    setUploading(false);
    if (ok) {
      toast.success(`${ok} archivo(s) subido(s).`);
      router.refresh();
    }
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiada.");
  };

  const del = (a: MediaAsset) => {
    if (!confirm("¿Eliminar este archivo?")) return;
    startTransition(async () => {
      const res = await deleteMediaAction(a.id, a.storage_path);
      if (res.ok) {
        toast.success("Eliminado.");
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });
  };

  const list = assets.filter((a) => !q || (a.original_name ?? a.file_name).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} style={inp}>
          {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, cursor: uploading ? "wait" : "pointer" }}>
          <UploadCloud size={16} /> {uploading ? "Subiendo…" : "Subir imágenes"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
        </label>
        <input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inp, flex: "1 1 180px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 14, opacity: pending ? 0.6 : 1 }}>
        {list.length === 0 && <p style={{ color: "#8a8a8a" }}>No hay archivos.</p>}
        {list.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "#eee" }}>
              {a.public_url && <Image src={a.public_url} alt={a.alt_text ?? ""} fill sizes="180px" style={{ objectFit: "cover" }} />}
            </div>
            <div style={{ padding: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#4D4D4E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.original_name ?? a.file_name}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button type="button" onClick={() => copy(a.public_url ?? "")} title="Copiar URL" style={smallBtn}><Copy size={14} /> URL</button>
                <button type="button" onClick={() => del(a)} title="Eliminar" style={{ ...smallBtn, color: "#b23b2f", marginLeft: "auto" }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const smallBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(5,5,5,.14)",
  background: "#fff",
  fontSize: 12,
  fontWeight: 600,
  color: "#050505",
  cursor: "pointer",
};
