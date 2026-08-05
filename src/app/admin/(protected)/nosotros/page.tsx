import { PageHeader } from "@/components/admin/PageHeader";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { getSingletonRow, getCollectionRows } from "@/lib/admin/fetch";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [about, values, stats] = await Promise.all([
    getSingletonRow("about_content"),
    getCollectionRows("company_values"),
    getCollectionRows("statistics"),
  ]);

  return (
    <div>
      <PageHeader title="Nosotros" subtitle="Sección institucional, valores y estadísticas." />
      <SingletonEditor singletonKey="about_content" initial={about} />

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "30px 0 14px" }}>Valores</h2>
      <CollectionEditor collectionKey="company_values" rows={values} />

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "30px 0 14px" }}>Estadísticas</h2>
      <CollectionEditor collectionKey="statistics" rows={stats} />
    </div>
  );
}
