"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, LinkIcon, Trash2 } from "lucide-react";
import { setIntroVideo } from "@/lib/actions/admin/gallery";

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: 20, marginBottom: 26, display: "flex", flexDirection: "column", gap: 14 };
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

export function IntroVideoBanner({ url, isEmbed }: { url: string | null; isEmbed: boolean }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const save = async (u: string, embed: boolean) => {
    const r = await setIntroVideo(u, embed);
    if (r.ok) { toast.success(u ? "Video actualizado." : "Video quitado."); router.refresh(); }
    else toast.error(r.error ?? "Error.");
  };

  const onUpload = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", f);
    fd.append("folder", "gallery");
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (res.ok && json.ok) await save(json.url, false);
    else toast.error(json.error ?? "No se pudo subir.");
  };

  return (
    <div style={card}>
      <div>
        <strong style={{ fontSize: 15 }}>Video de portada (arriba de Proyectos)</strong>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8a8a8a" }}>Se muestra a ancho completo en la home. Subí un video o pegá un link de YouTube/Vimeo. Si lo quitás, no aparece.</p>
      </div>

      {url ? (
        <div style={{ position: "relative", width: "100%", maxWidth: 520, aspectRatio: "16 / 9", background: "#111", borderRadius: 12, overflow: "hidden" }}>
          {isEmbed ? (
            <iframe src={toEmbed(url)} title="Video" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={url} controls preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: "#8a8a8a" }}>No hay video de portada.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <label style={{ ...btn, cursor: uploading ? "wait" : "pointer" }}>
          <UploadCloud size={16} /> {uploading ? "Subiendo…" : "Subir video"}
          <input type="file" accept="video/mp4,video/webm,video/quicktime" hidden disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
        </label>
        <div style={{ display: "flex", gap: 8, flex: "1 1 300px" }}>
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="…o pegá un link de YouTube/Vimeo" style={{ ...inp, flex: 1 }} />
          <button type="button" onClick={() => linkUrl.trim() && save(linkUrl.trim(), true)} style={{ ...btn, background: "#D9912F", color: "#050505" }}><LinkIcon size={15} /> Usar link</button>
        </div>
        {url && (
          <button type="button" onClick={() => save("", false)} style={{ ...btn, background: "#fff", color: "#b23b2f", border: "1px solid rgba(5,5,5,.14)" }}><Trash2 size={15} /> Quitar</button>
        )}
      </div>
    </div>
  );
}
