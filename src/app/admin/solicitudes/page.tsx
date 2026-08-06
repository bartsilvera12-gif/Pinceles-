"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaSubmissions } from "@/components/admin/spa/SpaSubmissions";

export default function SolicitudesAdminPage() {
  return (
    <SpaPage title="Solicitudes" subtitle="Consultas recibidas desde el formulario del sitio.">
      <SpaSubmissions />
    </SpaPage>
  );
}
