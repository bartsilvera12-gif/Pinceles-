import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import type { ProjectCategory, ProjectWithRelations } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const supabase = await createClient();
  const [projects, categories] = await Promise.all([
    supabase
      .schema("pinceles")
      .from("projects")
      .select("*, category:project_categories(*), images:project_images(*)")
      .order("sort_order"),
    supabase.schema("pinceles").from("project_categories").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <PageHeader title="Proyectos" subtitle="Gestioná la galería de trabajos realizados." actionLabel="Nuevo proyecto" actionHref="/admin/proyectos/nuevo" />
      <ProjectsTable
        projects={(projects.data as ProjectWithRelations[] | null) ?? []}
        categories={(categories.data as ProjectCategory[] | null) ?? []}
      />
    </div>
  );
}
