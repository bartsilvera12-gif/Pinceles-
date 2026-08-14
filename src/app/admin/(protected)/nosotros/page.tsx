import { PageHeader } from "@/components/admin/PageHeader";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { getSingletonRow } from "@/lib/admin/fetch";

export const dynamic = "force-dynamic";

export default async function Page() {
  const about = await getSingletonRow("about_content");

  return (
    <div>
      <PageHeader title="Nosotros" subtitle="Sección institucional." />
      <SingletonEditor singletonKey="about_content" initial={about} />

      {/* Editores de "Valores" y "Estadísticas" ocultados del panel a pedido.
          Las tablas company_values / statistics siguen intactas; para reactivarlos,
          volver a agregar los <CollectionEditor> con getCollectionRows("company_values"/"statistics"). */}
    </div>
  );
}
