"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaCollectionEditor } from "@/components/admin/spa/SpaCollectionEditor";

export default function DiferencialesAdminPage() {
  return (
    <SpaPage title="Diferenciales" subtitle="¿Por qué elegir Pinceles?">
      <SpaCollectionEditor collectionKey="differentiators" />
    </SpaPage>
  );
}
