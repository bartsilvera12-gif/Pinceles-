"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Trash2, UploadCloud, RefreshCw } from "lucide-react";
import { uploadImage } from "@/lib/admin/spa-upload";

type MediaFile = { name: string; folder: string; url: string; mtime: number };

const FOLDERS = ["general", "projects", "hero", "about", "testimonials"];
const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };

export function SpaMediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/listar-imagenes.php", { cache: "no-store" });
      const j = await r.json();
      setFiles(Array.isArray(j?.files) ? (j.files as MediaFile[]) : []);
    } catch {
      setFiles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onUpload = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    let ok = 0;
    for (const f of Array.from(list)) {
      const res = await uploadImage(f, folder);
      if (res.ok) ok++;
      else setMsg(res.error ?? `No se pudo subir ${f.name}.`);
    }
    setUploading(false);
    if (ok) { setMsg(`${ok} imagen(es) subida(s).`); load(); }
  };

  const copy = (url: string) => {
    const full = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setMsg("URL copiada.");
  };

  const del = async (url: string) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    const fd = new FormData();
    fd.append("url", url);
    try {
      const r = await fetch("/borrar-imagen.php", { method: "POST", body: fd });
      const j = await r.json();
      if (j?.ok) { setMsg("Eliminada."); load(); }
      else setMsg(j?.error ?? "No se pudo eliminar.");
    } catch {
      setMsg("No se pudo conectar con el servidor.");
    }
  };

  const shown = files.filter((f) => {
    const t = q.toLowerCase().trim();
    return !t || f.name.toLowerCase().includes(t) || f.folder.includes(t);
  });

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} style={inp} title="Carpeta destino de la subida">
          {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, cursor: uploading ? "wait" : "pointer" }}>
          <UploadCloud size={16} /> {uploading ? "Subiendo…" : "Subir imágenes"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
        </label>
        <input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inp, flex: "1 1 180px" }} />
        <button type="button" onClick={load} title="Recargar" style={{ ...inp, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={15} /> Recargar
        </button>
      </div>

      {msg && <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4D4D4E" }}>{msg}</p>}

      {loading ? (
        <p style={{ color: "#8a8a8a" }}>Cargando…</p>
      ) : shown.length === 0 ? (
        <p style={{ color: "#8a8a8a" }}>No hay imágenes todavía. Subí una con “Subir imágenes”.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 14 }}>
          {shown.map((a) => (
            <div key={a.url} style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "#eee" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#4D4D4E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={a.name}>{a.folder}/{a.name}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button type="button" onClick={() => copy(a.url)} title="Copiar URL" style={smallBtn}><Copy size={14} /> URL</button>
                  <button type="button" onClick={() => del(a.url)} title="Eliminar" style={{ ...smallBtn, color: "#b23b2f", marginLeft: "auto" }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
