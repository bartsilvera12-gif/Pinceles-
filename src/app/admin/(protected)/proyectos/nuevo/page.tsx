import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { ProjectCategory } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const supabase = await createClient();
  const { data } = await supabase.schema("pinceles").from("project_categories").select("*").order("sort_order");

  return (
    <div>
      <PageHeader title="Nuevo proyecto" subtitle="Cargá un trabajo realizado." />
      <ProjectForm categories={(data as ProjectCategory[] | null) ?? []} />
    </div>
  );
}
