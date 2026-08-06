import { getSupabase } from "@/lib/admin/spa";

// Subida de imágenes a Supabase Storage desde el navegador. Usa el mismo bucket
// y estructura que el /api/uploads original, y la sesión del usuario (las
// políticas de Storage ya permiten subir a un usuario autenticado).

const BUCKET = "pinceles-media";
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const FOLDERS = new Set(["hero", "about", "projects", "testimonials", "general"]);

export type UploadResult = { ok: boolean; url?: string; error?: string };

export type MediaAsset = {
  id: string;
  public_url: string;
  original_name: string | null;
  folder: string | null;
  created_at: string;
  alt_text: string | null;
};

function uid(): string {
  const c = typeof window !== "undefined" ? window.crypto : undefined;
  if (c && "randomUUID" in c) return c.randomUUID();
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

export async function uploadImage(file: File, folder = "general", adminId?: string): Promise<UploadResult> {
  if (!(file instanceof File)) return { ok: false, error: "Archivo faltante." };
  if (file.size > MAX_SIZE) return { ok: false, error: "El archivo supera 8 MB." };
  const ext = ALLOWED[file.type];
  if (!ext) return { ok: false, error: "Formato no permitido (JPG, PNG, WebP o AVIF)." };

  const f = FOLDERS.has(folder) ? folder : "general";
  const path = `${f}/${uid()}.${ext}`;
  const sb = getSupabase();

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return { ok: false, error: "No se pudo subir: " + (upErr.message ?? "") };

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;

  // Registrar en la biblioteca (best-effort; si falla, la imagen igual sirve).
  try {
    await sb.from("media_assets").insert({
      file_name: path.split("/").pop() ?? path,
      original_name: file.name,
      storage_path: path,
      public_url: url,
      media_type: "image",
      mime_type: file.type,
      file_size: file.size,
      folder: f,
      uploaded_by: adminId ?? null,
    });
  } catch {
    /* no crítico */
  }

  return { ok: true, url };
}

export async function listMedia(): Promise<MediaAsset[]> {
  const { data } = await getSupabase()
    .from("media_assets")
    .select("id, public_url, original_name, folder, created_at, alt_text")
    .order("created_at", { ascending: false })
    .limit(300);
  return (data as MediaAsset[] | null) ?? [];
}
