"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Briefcase, type LucideIcon } from "lucide-react";
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

type Stats = { projects: number; services: number };

function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const sb = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countOf = async (table: string) => {
        try {
          const { count } = await sb.from(table).select("*", { count: "exact", head: true });
          return (count as number | null) ?? 0;
        } catch {
          return 0;
        }
      };
      const [projects, services] = await Promise.all([countOf("projects"), countOf("services")]);
      if (active) {
        setStats({ projects, services });
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, maxWidth: 620 }}>
        <StatCard href="/admin/proyectos/" icon={ImageIcon} label="Proyectos" value={loading ? "…" : stats?.projects ?? 0} />
        <StatCard icon={Briefcase} label="Servicios" value={loading ? "…" : stats?.services ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: number | string; href?: string }) {
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 20px",
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(5,5,5,.08)",
        color: "#050505",
        height: "100%",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: "rgba(217,145,47,.12)", color: "#D9912F" }}>
        <Icon size={22} />
      </span>
      <span>
        <span style={{ display: "block", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</span>
        <span style={{ display: "block", marginTop: 4, fontSize: 13, fontWeight: 600, color: "#4D4D4E" }}>{label}</span>
      </span>
    </div>
  );
  return href ? <a href={href} style={{ display: "block" }}>{inner}</a> : inner;
}
