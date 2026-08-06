"use client";

import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";

/** Encabezado + shell del panel para las páginas de sección. */
export function SpaPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminSpaShell>
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,34px)", fontWeight: 700 }}>{title}</h1>
      {subtitle && <p style={{ margin: "8px 0 24px", fontSize: 15, color: "#4D4D4E" }}>{subtitle}</p>}
      {!subtitle && <div style={{ height: 24 }} />}
      {children}
    </AdminSpaShell>
  );
}
