"use client";

import { useEffect, useState } from "react";
import { Inbox, Image as ImageIcon, Briefcase, MessageSquare, type LucideIcon } from "lucide-react";
import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { getSupabase } from "@/lib/admin/spa";

export default function AdminHomePage() {
  return (
    <AdminSpaShell>
      <Dashboard />
    </AdminSpaShell>
  );
}

type Stats = { subsTotal: number; subsNew: number; projects: number; services: number; testimonials: number };
type RecentSub = { id: string; name: string; company: string | null; created_at: string; status: string };

function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentSub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const sb = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countOf = async (table: string, filter?: (q: any) => any) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let q: any = sb.from(table).select("*", { count: "exact", head: true });
          if (filter) q = filter(q);
          const { count } = await q;
          return (count as number | null) ?? 0;
        } catch {
          return 0;
        }
      };

      const [subsTotal, subsNew, projects, services, testimonials] = await Promise.all([
        countOf("contact_submissions"),
        countOf("contact_submissions", (q) => q.eq("status", "nuevo")),
        countOf("projects"),
        countOf("services"),
        countOf("testimonials"),
      ]);

      let recentData: RecentSub[] = [];
      try {
        const { data } = await sb
          .from("contact_submissions")
          .select("id, name, company, created_at, status")
          .order("created_at", { ascending: false })
          .limit(5);
        recentData = (data as RecentSub[] | null) ?? [];
      } catch {
        recentData = [];
      }

      if (active) {
        setStats({ subsTotal, subsNew, projects, services, testimonials });
        setRecent(recentData);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Resumen" subtitle={`Hola${admin?.full_name ? `, ${admin.full_name}` : ""}. Un vistazo rápido a tu sitio.`} />

      {/* Tarjetas de estadísticas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <StatCard href="/admin/solicitudes/" icon={Inbox} label="Solicitudes nuevas" value={loading ? "…" : stats?.subsNew ?? 0} accent />
        <StatCard href="/admin/solicitudes/" icon={Inbox} label="Solicitudes totales" value={loading ? "…" : stats?.subsTotal ?? 0} />
        <StatCard href="/admin/proyectos/" icon={ImageIcon} label="Proyectos" value={loading ? "…" : stats?.projects ?? 0} />
        <StatCard href="/admin/testimonios/" icon={MessageSquare} label="Testimonios" value={loading ? "…" : stats?.testimonials ?? 0} />
        <StatCard icon={Briefcase} label="Servicios" value={loading ? "…" : stats?.services ?? 0} />
      </div>

      {/* Últimas solicitudes */}
      <div style={{ marginTop: 26, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: "18px 20px", maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>Últimas solicitudes</h2>
          <a href="/admin/solicitudes/" style={{ fontSize: 13, fontWeight: 700, color: "#D9912F" }}>Ver todas →</a>
        </div>

        {loading ? (
          <p style={{ margin: 0, fontSize: 14, color: "#8a8a8a" }}>Cargando…</p>
        ) : recent.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: "#8a8a8a" }}>Todavía no hay solicitudes.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map((s) => (
              <a
                key={s.id}
                href="/admin/solicitudes/"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.07)", color: "#050505" }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.name}{s.company ? ` · ${s.company}` : ""}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "#8a8a8a" }}>{new Date(s.created_at).toLocaleString("es-PY")}</span>
                </span>
                <StatusBadge status={s.status} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, href, accent }: { icon: LucideIcon; label: string; value: number | string; href?: string; accent?: boolean }) {
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 20px",
        borderRadius: 16,
        background: accent ? "#050505" : "#fff",
        border: `1px solid ${accent ? "#050505" : "rgba(5,5,5,.08)"}`,
        color: accent ? "#fff" : "#050505",
        height: "100%",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: accent ? "rgba(217,145,47,.2)" : "rgba(217,145,47,.12)", color: "#D9912F" }}>
        <Icon size={22} />
      </span>
      <span>
        <span style={{ display: "block", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</span>
        <span style={{ display: "block", marginTop: 4, fontSize: 13, fontWeight: 600, color: accent ? "rgba(255,255,255,.7)" : "#4D4D4E" }}>{label}</span>
      </span>
    </div>
  );
  return href ? <a href={href} style={{ display: "block" }}>{inner}</a> : inner;
}

function StatusBadge({ status }: { status: string }) {
  const isNew = status === "nuevo";
  return (
    <span style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "capitalize", background: isNew ? "rgba(217,145,47,.14)" : "rgba(5,5,5,.06)", color: isNew ? "#B8761F" : "#4D4D4E" }}>
      {status}
    </span>
  );
}
