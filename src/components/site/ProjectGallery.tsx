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
      <div className="ind-filters" role="group" aria-label="Filtrar proyectos">
        {activeCats.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => { setFilter(label); setLbIndex(null); }}
            aria-pressed={filter === label}
            className={`ind-filter${filter === label ? " is-on" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ind-grid-proj">
        {list.map((p, i) => {
          const src = p.cover_image_url ?? p.images?.[0]?.image_url ?? "/images/logo-pinceles.jpg";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setLbIndex(i)}
              aria-label={`Ampliar imagen: ${p.title}`}
              className="ind-gcard"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={p.cover_image_alt ?? p.title} />
              <span className="cap">
                <span className="cap-main">
                  <span className="tt">{p.title}</span>
                  {p.location && <span className="lo">{p.location}</span>}
                </span>
                {p.category?.name && <span className="c">{p.category.name}</span>}
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
            position: "fixed", inset: 0, zIndex: 130, background: "rgba(5,5,5,.94)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 18, padding: "clamp(16px,4vw,48px)", animation: "pincelIn .2s ease both",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ display: "contents" }}>
            <Image
              src={lb.cover_image_url ?? lb.images?.[0]?.image_url ?? "/images/logo-pinceles.jpg"}
              alt={lb.cover_image_alt ?? lb.title}
              width={1280}
              height={860}
              style={{ maxWidth: "100%", maxHeight: "74vh", objectFit: "contain", width: "auto", height: "auto", border: "1px solid rgba(255,255,255,.14)" }}
            />
            <div style={{ textAlign: "center", color: "#ffffff" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-oswald), sans-serif", textTransform: "uppercase", fontSize: 22, fontWeight: 700 }}>{lb.title}</p>
              <p style={{ margin: "6px 0 0", fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#D9912F" }}>
                {[lb.category?.name, lb.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" aria-label="Imagen anterior" onClick={() => moveLb(-1)} className="ind-lbbtn"><Icon name="chevron-left" size={24} /></button>
              <button type="button" aria-label="Imagen siguiente" onClick={() => moveLb(1)} className="ind-lbbtn"><Icon name="chevron-right" size={24} /></button>
              <button type="button" aria-label="Cerrar" onClick={() => setLbIndex(null)} className="ind-lbbtn close"><Icon name="x" size={24} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
