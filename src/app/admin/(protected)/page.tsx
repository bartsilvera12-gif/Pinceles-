import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = await createClient();
  const p = () => supabase.schema("pinceles");
  const startMonth = new Date();
  startMonth.setDate(1);
  startMonth.setHours(0, 0, 0, 0);

  const [pub, draft, services, newReq, monthReq, recentProjects, recentReq] = await Promise.all([
    p().from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
    p().from("projects").select("*", { count: "exact", head: true }).eq("status", "draft"),
    p().from("services").select("*", { count: "exact", head: true }),
    p().from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "nuevo"),
    p().from("contact_submissions").select("*", { count: "exact", head: true }).gte("created_at", startMonth.toISOString()),
    p().from("projects").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    p().from("contact_submissions").select("id, name, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    published: pub.count ?? 0,
    draft: draft.count ?? 0,
    services: services.count ?? 0,
    newReq: newReq.count ?? 0,
    monthReq: monthReq.count ?? 0,
    recentProjects: (recentProjects.data ?? []) as { id: string; title: string; status: string; updated_at: string }[],
    recentReq: (recentReq.data ?? []) as { id: string; name: string; status: string; created_at: string }[],
  };
}

export default async function DashboardPage() {
  const d = await counts();
  const tiles = [
    { label: "Proyectos publicados", value: d.published, href: "/admin/proyectos" },
    { label: "Proyectos en borrador", value: d.draft, href: "/admin/proyectos" },
    { label: "Servicios", value: d.services, href: "/admin/servicios" },
    { label: "Solicitudes nuevas", value: d.newReq, href: "/admin/solicitudes" },
    { label: "Solicitudes del mes", value: d.monthReq, href: "/admin/solicitudes" },
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16, marginTop: 24 }}>
        <div style={cardS}>
          <h2 style={h2S}>Últimos proyectos</h2>
          {d.recentProjects.length === 0 && <p style={emptyS}>Sin proyectos.</p>}
          {d.recentProjects.map((p) => (
            <Link key={p.id} href={`/admin/proyectos/${p.id}`} style={rowS}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>
              <span style={badge(p.status)}>{p.status}</span>
            </Link>
          ))}
        </div>
        <div style={cardS}>
          <h2 style={h2S}>Últimas solicitudes</h2>
          {d.recentReq.length === 0 && <p style={emptyS}>Sin solicitudes.</p>}
          {d.recentReq.map((r) => (
            <Link key={r.id} href="/admin/solicitudes" style={rowS}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
              <span style={badge(r.status)}>{r.status}</span>
            </Link>
          ))}
        </div>
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
const h2S: React.CSSProperties = { margin: "0 0 12px", fontSize: 16, fontWeight: 700 };
const rowS: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "10px 0",
  borderTop: "1px solid rgba(5,5,5,.06)",
  color: "#050505",
};
const emptyS: React.CSSProperties = { margin: 0, fontSize: 14, color: "#8a8a8a" };

function badge(status: string): React.CSSProperties {
  const map: Record<string, string> = {
    published: "#1f8a4c",
    draft: "#b8761f",
    archived: "#8a8a8a",
    nuevo: "#D9912F",
    contactado: "#2f6bb2",
    cotizado: "#7a4db2",
    aprobado: "#1f8a4c",
    cerrado: "#4d4d4e",
    descartado: "#b23b2f",
  };
  const color = map[status] ?? "#4d4d4e";
  return { fontSize: 12, fontWeight: 700, color, background: `${color}1a`, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" };
}
