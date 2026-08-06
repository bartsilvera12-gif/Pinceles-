"use client";

import { SpaPage } from "@/components/admin/spa/SpaPage";
import { SpaSingletonEditor } from "@/components/admin/spa/SpaSingletonEditor";
import { SpaCollectionEditor } from "@/components/admin/spa/SpaCollectionEditor";

export default function NosotrosAdminPage() {
  return (
    <SpaPage title="Nosotros" subtitle="Sección institucional, valores y estadísticas.">
      <SpaSingletonEditor singletonKey="about_content" />

      <h2 style={sub}>Valores</h2>
      <SpaCollectionEditor collectionKey="company_values" />

      <h2 style={sub}>Estadísticas</h2>
      <SpaCollectionEditor collectionKey="statistics" />
    </SpaPage>
  );
}

const sub: React.CSSProperties = { margin: "34px 0 14px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 };
