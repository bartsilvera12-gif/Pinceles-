import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = await createClient();
  const p = () => supabase.schema("pinceles");

  const [pub, services] = await Promise.all([
    p().from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
    p().from("services").select("*", { count: "exact", head: true }),
  ]);

  return {
    published: pub.count ?? 0,
    services: services.count ?? 0,
  };
}

export default async function DashboardPage() {
  const d = await counts();
  const tiles = [
    { label: "Proyectos publicados", value: d.published, href: "/admin/proyectos" },
    { label: "Servicios", value: d.services, href: "/admin/servicios" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, margin: "0 0 6px" }}>Resumen</h1>
      <p style={{ margin: "0 0 24px", color: "#4D4D4E" }}>Estado general del sitio y últimas actividades.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16 }}>
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} style={{ ...cardS, color: "#050505" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{t.value}</span>
            <span style={{ marginTop: 8, fontSize: 14, color: "#4D4D4E" }}>{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const cardS: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  border: "1px solid rgba(5,5,5,.08)",
  borderRadius: 16,
  padding: 22,
};
