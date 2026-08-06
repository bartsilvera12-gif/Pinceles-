"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaCollectionEditor } from "@/components/admin/spa/SpaCollectionEditor";

export default function SeccionesAdminPage() {
  return (
    <SpaPage title="Secciones" subtitle="Activar/ocultar, reordenar y editar los textos de cada sección.">
      <SpaCollectionEditor collectionKey="site_sections" />
    </SpaPage>
  );
}
