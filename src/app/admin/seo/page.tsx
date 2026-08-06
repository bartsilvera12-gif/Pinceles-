"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaSingletonEditor } from "@/components/admin/spa/SpaSingletonEditor";

export default function SeoAdminPage() {
  return (
    <SpaPage title="SEO" subtitle="Metadatos generales del sitio.">
      <SpaSingletonEditor singletonKey="seo_settings" />
    </SpaPage>
  );
}
