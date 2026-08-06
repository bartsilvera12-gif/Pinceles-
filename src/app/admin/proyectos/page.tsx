"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaProjects } from "@/components/admin/spa/SpaProjects";

export default function ProyectosAdminPage() {
  return (
    <SpaPage title="Proyectos" subtitle="Galería de trabajos realizados.">
      <SpaProjects />
    </SpaPage>
  );
}
