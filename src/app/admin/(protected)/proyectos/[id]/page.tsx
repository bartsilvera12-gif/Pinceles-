import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { ProjectCategory, ProjectImage, Project } from "@/types/database.types";
import type { ProjectInput } from "@/lib/validations/project";

export const dynamic = "force-dynamic";

export default async function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: imagesData }, { data: categories }] = await Promise.all([
    supabase.schema("pinceles").from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.schema("pinceles").from("project_images").select("*").eq("project_id", id).order("sort_order"),
    supabase.schema("pinceles").from("project_categories").select("*").order("sort_order"),
  ]);

  if (!project) notFound();
  const p = project as Project;
  const imgs = (imagesData as ProjectImage[] | null) ?? [];

  const initial: Partial<ProjectInput> = {
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id ?? "",
    shortDescription: p.short_description ?? "",
    fullDescription: p.full_description ?? "",
    clientName: p.client_name ?? "",
    location: p.location ?? "",
    completionDate: p.completion_date ?? "",
    status: p.status,
    isFeatured: p.is_featured,
    isVisible: p.is_visible,
    seoTitle: p.seo_title ?? "",
    seoDescription: p.seo_description ?? "",
    coverImageUrl: p.cover_image_url ?? "",
    coverImageAlt: p.cover_image_alt ?? "",
    images: imgs.map((im) => ({
      id: im.id,
      imageUrl: im.image_url,
      altText: im.alt_text ?? "",
      caption: im.caption ?? "",
      isCover: im.is_cover,
      sortOrder: im.sort_order,
    })),
  };

  return (
    <div>
      <PageHeader title="Editar proyecto" subtitle={p.title} />
      <ProjectForm categories={(categories as ProjectCategory[] | null) ?? []} initial={initial} projectId={id} />
    </div>
  );
}
