"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { auditLog } from "@/lib/audit/log";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

export type ActionResult = { ok: boolean; id?: string; error?: string };

function normalize(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    category_id: input.categoryId || null,
    short_description: input.shortDescription || null,
    full_description: input.fullDescription || null,
    client_name: input.clientName || null,
    location: input.location || null,
    completion_date: input.completionDate || null,
    status: input.status,
    is_featured: input.isFeatured,
    is_visible: input.isVisible,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
    cover_image_url: input.coverImageUrl || null,
    cover_image_alt: input.coverImageAlt || null,
  };
}

async function saveImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  input: ProjectInput
) {
  // Reemplaza el set de imágenes del proyecto (delete + insert).
  await supabase.schema("pinceles").from("project_images").delete().eq("project_id", projectId);
  const rows = input.images.map((img, i) => ({
    project_id: projectId,
    image_url: img.imageUrl,
    alt_text: img.altText || null,
    caption: img.caption || null,
    is_cover: img.isCover,
    sort_order: img.sortOrder ?? i,
  }));
  if (rows.length) await supabase.schema("pinceles").from("project_images").insert(rows);
}

export async function createProjectAction(input: ProjectInput): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos. Revisá el formulario." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("pinceles")
    .from("projects")
    .insert({ ...normalize(parsed.data), created_by: admin.id, updated_by: admin.id })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return { ok: false, error: "Ya existe un proyecto con ese slug." };
    return { ok: false, error: "No se pudo crear el proyecto." };
  }

  await saveImages(supabase, data.id, parsed.data);
  await auditLog({ adminId: admin.id, action: "create", entityType: "project", entityId: data.id, newData: normalize(parsed.data) });

  revalidatePath("/");
  revalidatePath("/admin/proyectos");
  return { ok: true, id: data.id };
}

export async function updateProjectAction(id: string, input: ProjectInput): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos. Revisá el formulario." };

  const supabase = await createClient();
  const { error } = await supabase
    .schema("pinceles")
    .from("projects")
    .update({ ...normalize(parsed.data), updated_by: admin.id })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un proyecto con ese slug." };
    return { ok: false, error: "No se pudo actualizar el proyecto." };
  }

  await saveImages(supabase, id, parsed.data);
  await auditLog({ adminId: admin.id, action: "update", entityType: "project", entityId: id, newData: normalize(parsed.data) });

  revalidatePath("/");
  revalidatePath("/admin/proyectos");
  return { ok: true, id };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const supabase = await createClient();
  // project_images se borra en cascada (FK on delete cascade).
  const { error } = await supabase.schema("pinceles").from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar el proyecto." };

  await auditLog({ adminId: admin.id, action: "delete", entityType: "project", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/proyectos");
  return { ok: true };
}

export async function setProjectStatusAction(
  id: string,
  status: "draft" | "published" | "archived"
): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "No autorizado." };

  const supabase = await createClient();
  const { error } = await supabase
    .schema("pinceles")
    .from("projects")
    .update({ status, updated_by: admin.id })
    .eq("id", id);
  if (error) return { ok: false, error: "No se pudo cambiar el estado." };

  await auditLog({
    adminId: admin.id,
    action: status === "published" ? "publish" : "unpublish",
    entityType: "project",
    entityId: id,
    newData: { status },
  });
  revalidatePath("/");
  revalidatePath("/admin/proyectos");
  return { ok: true };
}
