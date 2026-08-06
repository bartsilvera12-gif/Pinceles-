"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { PendingNotice } from "@/components/admin/spa/PendingNotice";

export default function ProyectosAdminPage() {
  return (
    <SpaPage title="Proyectos" subtitle="Galería de trabajos realizados.">
      <PendingNotice reason="Los proyectos incluyen galería de imágenes con subida de archivos, que se implementa junto a Multimedia (subida directa a Supabase Storage). Mientras tanto, los proyectos existentes se siguen mostrando en el sitio." />
    </SpaPage>
  );
}
