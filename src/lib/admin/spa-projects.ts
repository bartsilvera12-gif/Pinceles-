import { getSupabase } from "@/lib/admin/spa";

// CRUD client-side de Proyectos (tabla projects + project_images + categorías).
// Espeja las Server Actions del admin dinámico, con la sesión del usuario (RLS).

export type ProjectImage = {
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  is_cover: boolean;
  sort_order: number;
};

export type Category = { id: string; name: string };

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  full_description: string | null;
  client_name: string | null;
  location: string | null;
  completion_date: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_visible: boolean;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category?: Category | null;
  images?: ProjectImage[];
};

export type SaveResult = { ok: boolean; id?: string; error?: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await getSupabase().from("project_categories").select("id, name").order("sort_order");
  return (data as Category[] | null) ?? [];
}

export async function listProjects(): Promise<ProjectRow[]> {
  const { data } = await getSupabase()
    .from("projects")
    .select("*, category:project_categories(id,name), images:project_images(*)")
    .order("sort_order");
  const rows = (data as ProjectRow[] | null) ?? [];
  for (const p of rows) {
    if (Array.isArray(p.images)) p.images.sort((a, b) => a.sort_order - b.sort_order);
  }
  return rows;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveProject(id: string | null, v: any, adminId?: string): Promise<SaveResult> {
  const title = String(v.title ?? "").trim();
  const slug = String(v.slug ?? "").trim();
  if (title.length < 2) return { ok: false, error: "El título es obligatorio." };
  if (!SLUG_RE.test(slug)) return { ok: false, error: "Slug inválido: solo minúsculas, números y guiones." };

  const row = {
    title,
    slug,
    category_id: v.category_id || null,
    short_description: v.short_description || null,
    full_description: v.full_description || null,
    client_name: v.client_name || null,
    location: v.location || null,
    completion_date: v.completion_date || null,
    status: v.status || "draft",
    is_featured: !!v.is_featured,
    is_visible: v.is_visible !== false,
    cover_image_url: v.cover_image_url || null,
    cover_image_alt: v.cover_image_alt || null,
    seo_title: v.seo_title || null,
    seo_description: v.seo_description || null,
  };

  const sb = getSupabase();
  let projectId = id;

  if (id) {
    const { error } = await sb.from("projects").update({ ...row, updated_by: adminId ?? null }).eq("id", id);
    if (error) return { ok: false, error: error.code === "23505" ? "Ya existe un proyecto con ese slug." : "No se pudo guardar. " + (error.message ?? "") };
  } else {
    const { data, error } = await sb
      .from("projects")
      .insert({ ...row, created_by: adminId ?? null, updated_by: adminId ?? null })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.code === "23505" ? "Ya existe un proyecto con ese slug." : "No se pudo crear. " + (error?.message ?? "") };
    projectId = (data as { id: string }).id;
  }

  // Galería: reemplazar el set completo (delete + insert), como el admin dinámico.
  await sb.from("project_images").delete().eq("project_id", projectId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imgs = (v.images ?? []).filter((i: any) => String(i.image_url ?? "").trim());
  if (imgs.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = imgs.map((img: any, i: number) => ({
      project_id: projectId,
      image_url: String(img.image_url).trim(),
      alt_text: img.alt_text || null,
      caption: img.caption || null,
      is_cover: !!img.is_cover,
      sort_order: i,
    }));
    const { error: imgErr } = await sb.from("project_images").insert(rows);
    if (imgErr) return { ok: true, id: projectId!, error: "Proyecto guardado, pero la galería no se pudo actualizar." };
  }

  return { ok: true, id: projectId! };
}

export async function deleteProject(id: string): Promise<SaveResult> {
  const { error } = await getSupabase().from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar." };
  return { ok: true };
}

export async function setProjectStatus(id: string, status: "draft" | "published" | "archived", adminId?: string): Promise<SaveResult> {
  const { error } = await getSupabase().from("projects").update({ status, updated_by: adminId ?? null }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo cambiar el estado." };
  return { ok: true };
}
