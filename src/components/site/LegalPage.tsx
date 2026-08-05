import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { LegalPage as LegalPageType, SiteSettings } from "@/types/database.types";
import { notFound } from "next/navigation";

export async function LegalPage({ slug }: { slug: string }) {
  const supabase = await createClient();
  const [{ data: page }, { data: settings }] = await Promise.all([
    supabase.schema("pinceles").from("legal_pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle(),
    supabase.schema("pinceles").from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  if (!page) notFound();
  const p = page as LegalPageType;
  const s = settings as SiteSettings | null;

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#050505", background: "#fff", minHeight: "100dvh" }}>
      <header style={{ borderBottom: "1px solid rgba(5,5,5,.08)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px clamp(18px,4vw,36px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/"><Image src={s?.logo_url ?? "/images/logo-pinceles.jpg"} alt="Pinceles" width={140} height={119} style={{ height: 48, width: "auto", mixBlendMode: "multiply" }} /></Link>
          <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: "#050505", border: "1px solid rgba(5,5,5,.14)", borderRadius: 12, padding: "9px 16px" }}>← Volver</Link>
        </div>
      </header>

      <section style={{ background: "#F8F6F1", padding: "clamp(40px,7vw,70px) 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(18px,4vw,36px)" }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-.02em" }}>{p.title}</h1>
        </div>
      </section>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(18px,4vw,36px)" }}>
        {(p.content ?? "").split(/\n{2,}/).map((para, i) => (
          <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: "#2b2b2c", margin: "0 0 18px" }}>{para}</p>
        ))}
      </main>

      <footer style={{ background: "#050505", color: "rgba(255,255,255,.6)", padding: "30px 0", textAlign: "center", fontSize: 13 }}>
        Desarrollado por{" "}
        <a href="https://neura.com.py" target="_blank" rel="noopener" style={{ color: "#D9912F", fontWeight: 700 }}>NEURA</a>
      </footer>
    </div>
  );
}
