"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Video, LinkIcon, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, UploadCloud, Copy } from "lucide-react";
import type { GalleryItem } from "@/types/database.types";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem, reorderGallery } from "@/lib/actions/admin/gallery";

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };
const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" };

function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) { if (u.pathname.startsWith("/embed/")) return url; const id = u.searchParams.get("v"); if (id) return `https://www.youtube.com/embed/${id}`; }
    if (u.hostname.includes("vimeo.com")) { const id = u.pathname.split("/").filter(Boolean)[0]; if (id) return `https://player.vimeo.com/video/${id}`; }
  } catch { /* noop */ }
  return url;
}

export function GalleryEditor({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "gallery");
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok && json.ok) return json.url as string;
    toast.error(json.error ?? "No se pudo subir.");
    return null;
  };

  const onUpload = async (files: FileList | null, mediaType: "image" | "video") => {
    if (!files?.length) return;
    setUploading(true);
    for (const f of Array.from(files)) {
      const url = await upload(f);
      if (url) {
        const r = await createGalleryItem({ media_type: mediaType, url, is_embed: false });
        if (!r.ok) toast.error(r.error ?? "Error.");
      }
    }
    setUploading(false);
    router.refresh();
  };

  const addVideoLink = () => {
    const url = videoUrl.trim();
    if (!url) return;
    startTransition(async () => {
      const r = await createGalleryItem({ media_type: "video", url, is_embed: true });
      if (r.ok) { setVideoUrl(""); toast.success("Video agregado."); router.refresh(); }
      else toast.error(r.error ?? "Error.");
    });
  };

  const del = (id: string) => {
    if (!confirm("¿Eliminar este elemento?")) return;
    startTransition(async () => { const r = await deleteGalleryItem(id); if (r.ok) router.refresh(); else toast.error(r.error ?? "Error."); });
  };

  const toggle = (it: GalleryItem) => {
    startTransition(async () => { const r = await updateGalleryItem(it.id, { is_visible: !it.is_visible }); if (r.ok) router.refresh(); else toast.error(r.error ?? "Error."); });
  };

  const saveTitle = (id: string, title: string) => {
    startTransition(async () => { await updateGalleryItem(id, { title }); router.refresh(); });
  };

  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((x) => x.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    startTransition(async () => { const r = await reorderGallery(ids); if (r.ok) router.refresh(); else toast.error(r.error ?? "Error."); });
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <label style={{ ...btn, cursor: uploading ? "wait" : "pointer" }}>
          {uploading ? <UploadCloud size={16} /> : <ImagePlus size={16} />} Subir imagen
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files, "image")} />
        </label>
        <label style={{ ...btn, cursor: uploading ? "wait" : "pointer" }}>
          <Video size={16} /> Subir video
          <input type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files, "video")} />
        </label>
        <div style={{ display: "flex", gap: 8, flex: "1 1 320px" }}>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Pegar link de YouTube o Vimeo…" style={{ ...inp, flex: 1 }} />
          <button type="button" onClick={addVideoLink} style={{ ...btn, background: "#D9912F", color: "#050505" }}><LinkIcon size={15} /> Agregar</button>
        </div>
      </div>
      <p style={{ margin: "0 0 18px", fontSize: 12.5, color: "#8a8a8a" }}>Imágenes hasta 8 MB · videos hasta 60 MB · o pegá el link de un video de YouTube/Vimeo.</p>

      {items.length === 0 ? (
        <p style={{ color: "#8a8a8a" }}>Todavía no hay elementos. Subí una imagen o un video.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px,1fr))", gap: 14, opacity: pending ? 0.6 : 1 }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, overflow: "hidden", opacity: it.is_visible ? 1 : 0.55 }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#111" }}>
                {it.media_type === "video" ? (
                  it.is_embed ? (
                    <iframe src={toEmbed(it.url)} title={it.title ?? "Video"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video src={it.url} controls preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.url} alt={it.title ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <input defaultValue={it.title ?? ""} onBlur={(e) => { if (e.target.value !== (it.title ?? "")) saveTitle(it.id, e.target.value); }} placeholder="Título (opcional)" style={{ ...inp, minHeight: 36, fontSize: 13 }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" title="Copiar URL" onClick={() => { navigator.clipboard.writeText(it.url); toast.success("URL copiada."); }} style={smallBtn}><Copy size={14} /></button>
                  <button type="button" title={it.is_visible ? "Ocultar" : "Mostrar"} onClick={() => toggle(it)} style={smallBtn}>{it.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button type="button" title="Subir" onClick={() => move(i, -1)} style={smallBtn}><ArrowUp size={14} /></button>
                  <button type="button" title="Bajar" onClick={() => move(i, 1)} style={smallBtn}><ArrowDown size={14} /></button>
                  <button type="button" title="Eliminar" onClick={() => del(it.id)} style={{ ...smallBtn, color: "#b23b2f", marginLeft: "auto" }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const smallBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "7px 9px", borderRadius: 8, border: "1px solid rgba(5,5,5,.14)", background: "#fff", fontSize: 12, fontWeight: 600, color: "#050505", cursor: "pointer" };
