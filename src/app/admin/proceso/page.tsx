"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaCollectionEditor } from "@/components/admin/spa/SpaCollectionEditor";

export default function ProcesoAdminPage() {
  return (
    <SpaPage title="Proceso" subtitle="Pasos del proceso de trabajo.">
      <SpaCollectionEditor collectionKey="process_steps" />
    </SpaPage>
  );
}
