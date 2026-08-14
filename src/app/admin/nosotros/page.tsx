"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaSingletonEditor } from "@/components/admin/spa/SpaSingletonEditor";

export default function NosotrosAdminPage() {
  return (
    <SpaPage title="Nosotros" subtitle="Sección institucional.">
      <SpaSingletonEditor singletonKey="about_content" />
      {/* Editores de "Valores" y "Estadísticas" ocultados del panel a pedido.
          Las tablas company_values / statistics siguen intactas. */}
    </SpaPage>
  );
}
