import Link from "next/link";
import { getPublicSiteContent } from "@/lib/data/get-public-site-content";
import { Header } from "@/components/site/Header";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

const OCRE = "#D9912F";
const wrap: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 clamp(18px,3vw,36px)" };
const eyebrow: React.CSSProperties = { margin: "0 0 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: OCRE };

export default async function ProyectosPage() {
  const c = await getPublicSiteContent();
  const projectsSection = c.sections["projects"];

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#050505", background: "#ffffff", overflowX: "hidden", maxWidth: "100vw", minHeight: "100vh" }}>
      <Header settings={c.settings} navigation={c.navigation} />

      <section style={{ padding: "clamp(120px,14vw,168px) 0 clamp(64px,8vw,110px)", background: "#F8F6F1" }}>
        <div style={wrap}>
          <Link href="/#proyectos" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#4D4D4E", marginBottom: 22 }}>
            <Icon name="chevron-left" size={18} />
            Volver al inicio
          </Link>
          <p style={eyebrow}>{projectsSection?.eyebrow ?? "Proyectos"}</p>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(34px,5vw,60px)", lineHeight: 1.05, letterSpacing: "-.02em" }}>
            {projectsSection?.title ?? "Trabajos realizados"}
          </h1>
          {projectsSection?.description && (
            <p style={{ margin: "18px 0 0", maxWidth: "60ch", fontSize: 17, lineHeight: 1.65, color: "#4D4D4E" }}>{projectsSection.description}</p>
          )}

          <div style={{ marginTop: "clamp(30px,4vw,48px)" }}>
            {c.projects.length > 0 ? (
              <ProjectGallery projects={c.projects} categories={c.categories} />
            ) : (
              <p style={{ fontSize: 16, color: "#4D4D4E" }}>Pronto publicaremos nuestros trabajos.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
