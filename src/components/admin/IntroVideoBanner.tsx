"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Film, Trash2 } from "lucide-react";
import { setIntroVideo } from "@/lib/actions/admin/gallery";
import type { GalleryItem } from "@/types/database.types";

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: 20, marginBottom: 26, display: "flex", flexDirection: "column", gap: 14 };
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

/**
 * Video de portada (banner de la home): es uno solo y se elige entre los
 * videos ya cargados en la galería, con el botón "Cambiar video".
 */
export function IntroVideoBanner({ url, isEmbed, videos }: { url: string | null; isEmbed: boolean; videos: GalleryItem[] }) {
  const router = useRouter();
  const [picking, setPicking] = useState(false);

  const save = async (u: string, embed: boolean) => {
    const r = await setIntroVideo(u, embed);
    if (r.ok) { toast.success(u ? "Video de portada actualizado." : "Video de portada quitado."); setPicking(false); router.refresh(); }
    else toast.error(r.error ?? "Error.");
  };

  return (
    <div style={card}>
      <div>
        <strong style={{ fontSize: 15 }}>Video de portada (arriba de Proyectos)</strong>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8a8a8a" }}>Se muestra a ancho completo en la home. Es uno solo y se elige de los videos de la galería. Si lo quitás, no aparece.</p>
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
        <button type="button" onClick={() => setPicking((v) => !v)} style={{ ...btn, background: "#D9912F", color: "#050505" }}>
          <Film size={15} /> Cambiar video
        </button>
        {url && (
          <button type="button" onClick={() => save("", false)} style={{ ...btn, background: "#fff", color: "#b23b2f", border: "1px solid rgba(5,5,5,.14)" }}>
            <Trash2 size={15} /> Quitar
          </button>
        )}
      </div>

      {picking && (
        videos.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: "#8a8a8a" }}>No hay videos en la galería. Agregá uno más abajo y volvé a intentar.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
            {videos.map((v) => {
              const active = v.url === url;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => save(v.url, v.is_embed)}
                  title={active ? "Video actual" : "Usar este video"}
                  style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 10, overflow: "hidden", background: "#111", cursor: "pointer", padding: 0, border: active ? "3px solid #D9912F" : "1px solid rgba(5,5,5,.14)" }}
                >
                  {v.is_embed ? (
                    <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff" }}>
                      <Film size={22} />
                    </span>
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video src={v.url} preload="metadata" muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {active && (
                    <span style={{ position: "absolute", top: 6, left: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#050505", background: "#D9912F", padding: "3px 7px", borderRadius: 6 }}>
                      Actual
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
