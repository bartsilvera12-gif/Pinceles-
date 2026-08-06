"use client";

import { AdminSpaShell } from "@/components/admin/spa/AdminSpaShell";
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
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,36px)", fontWeight: 700 }}>
        Hola{admin?.full_name ? `, ${admin.full_name}` : ""}
      </h1>
      <p style={{ margin: "12px 0 0", fontSize: 16, color: "#4D4D4E", maxWidth: "60ch" }}>
        Panel de administración (versión estática). Los cambios se guardan en vivo directamente en la base de datos.
      </p>
      <div style={{ marginTop: 28, padding: 20, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, maxWidth: 560 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Fase de prueba</p>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#4D4D4E" }}>
          Por ahora está habilitada la sección <strong>Hero</strong>. Si funciona bien, se habilitan el resto de las secciones.
        </p>
      </div>
    </div>
  );
}
