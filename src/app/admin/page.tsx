"use client";

import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAuth } from "@/components/admin/spa/AuthProvider";

export default function AdminHomePage() {
  return (
    <AdminSpaShell>
      <Dashboard />
    </AdminSpaShell>
  );
}

function Dashboard() {
  const { admin } = useAuth();
  return (
    <div>
      <PageHeader title="Resumen" subtitle={`Hola${admin?.full_name ? `, ${admin.full_name}` : ""}. Gestioná el contenido del sitio.`} />
      <div style={{ padding: 20, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, maxWidth: 620 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#4D4D4E", lineHeight: 1.6 }}>
          Los cambios se guardan en vivo en la base de datos. Elegí una sección en el menú de la izquierda para empezar.
        </p>
      </div>
    </div>
  );
}
