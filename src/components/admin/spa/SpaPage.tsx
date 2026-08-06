"use client";

import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";
import { PageHeader } from "@/components/admin/PageHeader";

/** Encabezado + shell del panel para las páginas de sección (diseño idéntico a Vercel). */
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
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </AdminSpaShell>
  );
}
