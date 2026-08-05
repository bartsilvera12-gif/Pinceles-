"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { ProjectCategory, ProjectWithRelations } from "@/types/database.types";

export function ProjectGallery({
  projects,
  categories,
}: {
  projects: ProjectWithRelations[];
  categories: ProjectCategory[];
}) {
  const [filter, setFilter] = useState("Todos");
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  // Solo categorías que tienen al menos un proyecto publicado
  const activeCats = useMemo(() => {
    const present = new Set(projects.map((p) => p.category?.name).filter(Boolean) as string[]);
    return ["Todos", ...categories.map((c) => c.name).filter((n) => present.has(n))];
  }, [projects, categories]);

  const list = useMemo(
    () => (filter === "Todos" ? projects : projects.filter((p) => p.category?.name === filter)),
    [filter, projects]
  );

  const moveLb = (dir: number) => {
    setLbIndex((cur) => (cur === null || !list.length ? cur : (cur + dir + list.length) % list.length));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lbIndex === null) return;
      if (e.key === "Escape") setLbIndex(null);
      if (e.key === "ArrowRight") moveLb(1);
      if (e.key === "ArrowLeft") moveLb(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = lbIndex !== null ? "hidden" : "";
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbIndex, list.length]);

  const lb = lbIndex !== null ? list[lbIndex] : null;

  return (
    <>
      <div role="group" aria-label="Filtrar proyectos" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {activeCats.map((label) => {
          const on = filter === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                setFilter(label);
                setLbIndex(null);
              }}
              aria-pressed={on}
              style={{
                padding: "11px 18px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${on ? "#050505" : "rgba(5,5,5,.14)"}`,
                background: on ? "#050505" : "#ffffff",
                color: on ? "#ffffff" : "#4D4D4E",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 20,
          marginTop: "clamp(30px,4vw,46px)",
        }}
      >
        {list.map((p, i) => {
          const src = p.cover_image_url ?? p.images?.[0]?.image_url ?? "/images/logo-pinceles.jpg";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setLbIndex(i)}
              aria-label={`Ampliar imagen: ${p.title}`}
              style={{
                position: "relative",
                display: "block",
                padding: 0,
                border: "none",
                cursor: "zoom-in",
                background: "#050505",
                borderRadius: 18,
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <Image
                src={src}
                alt={p.cover_image_alt ?? p.title}
                width={800}
                height={520}
                style={{ width: "100%", height: 260, objectFit: "cover", display: "block", opacity: 0.92 }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  padding: "44px 20px 18px",
                  background: "linear-gradient(to top, rgba(5,5,5,.86), rgba(5,5,5,0))",
                  color: "#ffffff",
                  display: "block",
                }}
              >
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#DEB97F" }}>
                  {p.category?.name ?? ""}
                </span>
                <span style={{ display: "block", marginTop: 6, fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>{p.title}</span>
                <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "rgba(255,255,255,.72)" }}>{p.location ?? ""}</span>
              </span>
            </button>
          );
        })}
      </div>

      {lb && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          onClick={() => setLbIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 130,
            background: "rgba(5,5,5,.94)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            padding: "clamp(16px,4vw,48px)",
            animation: "pincelIn .2s ease both",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ display: "contents" }}>
            <Image
              src={lb.cover_image_url ?? lb.images?.[0]?.image_url ?? "/images/logo-pinceles.jpg"}
              alt={lb.cover_image_alt ?? lb.title}
              width={1280}
              height={860}
              style={{ maxWidth: "100%", maxHeight: "74vh", objectFit: "contain", borderRadius: 12, width: "auto", height: "auto" }}
            />
            <div style={{ textAlign: "center", color: "#ffffff" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#DEB97F" }}>
                {lb.category?.name ?? ""}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 18, fontWeight: 600 }}>{lb.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgba(255,255,255,.7)" }}>{lb.location ?? ""}</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" aria-label="Imagen anterior" onClick={() => moveLb(-1)} style={lbBtn}>
                <Icon name="chevron-left" size={24} />
              </button>
              <button type="button" aria-label="Imagen siguiente" onClick={() => moveLb(1)} style={lbBtn}>
                <Icon name="chevron-right" size={24} />
              </button>
              <button type="button" aria-label="Cerrar" onClick={() => setLbIndex(null)} style={{ ...lbBtn, border: "none", background: "#D9912F", color: "#050505" }}>
                <Icon name="x" size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const lbBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 52,
  height: 52,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.25)",
  background: "transparent",
  color: "#ffffff",
  cursor: "pointer",
};
