"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicSiteContent, type PublicSiteContent } from "@/lib/data/get-public-site-content";
import { IndHeader } from "@/components/site/ind/IndHeader";
import { IndGridBg } from "@/components/site/ind/IndGridBg";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Icon } from "@/components/ui/Icon";

export default function ProyectosPage() {
  // En vivo desde Supabase (refleja los cambios del panel).
  const [c, setC] = useState<PublicSiteContent | null>(null);
  useEffect(() => {
    getPublicSiteContent().then(setC).catch(() => setC(null));
  }, []);

  if (!c) return <div style={{ minHeight: "100vh", background: "#ffffff" }} />;

  const s = c.sections["projects"];

  // Ocultar por código el proyecto "torre residencial" (proj-torre) — no debe mostrarse.
  const projects = c.projects.filter((p) => {
    const str = [
      p.title,
      p.cover_image_url,
      p.cover_image_alt,
      ...(p.images?.map((i) => i.image_url) ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return !(str.includes("proj-torre") || str.includes("torre residencial"));
  });

  return (
    <div className="ind-root" style={{ minHeight: "100vh" }}>
      <IndGridBg />
      <div className="ind-page">
        <IndHeader settings={c.settings} navigation={c.navigation} />

        <section className="ind-block" style={{ paddingTop: "clamp(40px,5vw,64px)" }}>
          <div className="ind-wrap">
            <Link href="/" className="ind-back">
              <Icon name="chevron-left" size={16} />
              Volver al inicio
            </Link>
            <span className="ind-label">{s?.eyebrow ?? "Proyectos"}</span>
            <h1 className="ind-h1" style={{ fontSize: "clamp(40px,6.5vw,92px)", marginTop: 14 }}>
              {s?.title ?? "Trabajos realizados"}
            </h1>
            {s?.description && (
              <p className="ind-hero-desc" style={{ marginTop: 18 }}>{s.description}</p>
            )}

            <div style={{ marginTop: "clamp(30px,4vw,48px)" }}>
              {projects.length > 0 ? (
                <ProjectGallery projects={projects} categories={c.categories} />
              ) : (
                <p style={{ color: "var(--muted)", fontSize: 16 }}>Pronto publicaremos nuestros trabajos.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
