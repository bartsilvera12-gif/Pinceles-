"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/admin/spa/AuthProvider";

function Spinner({ label }: { label: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F8F6F1" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "4px solid #D9912F",
            borderTopColor: "transparent",
            animation: "pincelSpin .8s linear infinite",
          }}
        />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#8a8a8a" }}>{label}</p>
      </div>
      <style>{`@keyframes pincelSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Enlaces del panel. En esta fase de prueba solo Hero está implementado.
const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/hero", label: "Hero" },
];

/**
 * Guardia + shell del panel. Muestra spinner mientras carga la sesión; si no
 * hay admin activo, redirige a /admin/login. Envuelve el contenido con la
 * navegación lateral.
 */
export function AdminSpaShell({ children }: { children: React.ReactNode }) {
  const { loading, admin, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !admin) router.replace("/admin/login");
  }, [loading, admin, router]);

  if (loading) return <Spinner label="Cargando panel…" />;
  if (!admin) return <Spinner label="Redirigiendo…" />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8F6F1", fontFamily: "var(--font-sans)" }}>
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: "#050505",
          color: "#fff",
          padding: "26px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <p style={{ margin: "0 8px 18px", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Pinceles</p>
        {NAV.map((n) => {
          const on = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: on ? "#050505" : "rgba(255,255,255,.82)",
                background: on ? "#D9912F" : "transparent",
              }}
            >
              {n.label}
            </Link>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "0 8px", fontSize: 12, color: "rgba(255,255,255,.5)" }}>
          {admin.full_name || admin.email}
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.replace("/admin/login");
          }}
          style={{
            marginTop: 8,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.22)",
            background: "transparent",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: "clamp(20px,3vw,40px)", overflowX: "auto" }}>{children}</main>
    </div>
  );
}
