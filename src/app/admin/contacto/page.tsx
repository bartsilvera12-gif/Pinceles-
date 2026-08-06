"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaSingletonEditor } from "@/components/admin/spa/SpaSingletonEditor";

export default function ContactoAdminPage() {
  return (
    <SpaPage title="Contacto" subtitle="Datos de contacto del sitio.">
      <SpaSingletonEditor singletonKey="contact_settings" />
    </SpaPage>
  );
}
