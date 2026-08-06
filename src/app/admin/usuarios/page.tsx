"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { PendingNotice } from "@/components/admin/spa/PendingNotice";

export default function UsuariosAdminPage() {
  return (
    <SpaPage title="Usuarios" subtitle="Administradores del panel.">
      <PendingNotice reason="Crear y administrar usuarios requiere permisos privilegiados (service role) que NO son seguros desde el navegador. En hosting estático esto se gestiona desde el panel de Supabase (Authentication → Users) o desde la versión con servidor (Vercel)." />
    </SpaPage>
  );
}
