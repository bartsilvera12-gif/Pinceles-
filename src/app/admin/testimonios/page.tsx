"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaCollectionEditor } from "@/components/admin/spa/SpaCollectionEditor";

export default function TestimoniosAdminPage() {
  return (
    <SpaPage title="Testimonios" subtitle="Se muestran en el sitio solo si están publicados y visibles.">
      <SpaCollectionEditor collectionKey="testimonials" />
    </SpaPage>
  );
}
