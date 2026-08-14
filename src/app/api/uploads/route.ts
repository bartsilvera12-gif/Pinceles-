import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";

export const runtime = "nodejs";

const BUCKET = "pinceles-media";
const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const MAX_VIDEO = 60 * 1024 * 1024; // 60 MB
const ALLOWED: Record<string, { ext: string; kind: "image" | "video" }> = {
  "image/jpeg": { ext: "jpg", kind: "image" },
  "image/png": { ext: "png", kind: "image" },
  "image/webp": { ext: "webp", kind: "image" },
  "image/avif": { ext: "avif", kind: "image" },
  "video/mp4": { ext: "mp4", kind: "video" },
  "video/webm": { ext: "webm", kind: "video" },
  "video/quicktime": { ext: "mov", kind: "video" },
};
const FOLDERS = new Set(["hero", "about", "projects", "testimonials", "general", "gallery"]);

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "general");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "general";
  const altText = String(form.get("alt") ?? "").slice(0, 300);

  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Archivo faltante." }, { status: 400 });

  const allowed = ALLOWED[file.type];
  if (!allowed) return NextResponse.json({ ok: false, error: "Formato no permitido (imágenes JPG/PNG/WebP/AVIF o videos MP4/WebM/MOV)." }, { status: 415 });
  const { ext, kind } = allowed;
  const maxSize = kind === "video" ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > maxSize) return NextResponse.json({ ok: false, error: `El archivo supera ${Math.round(maxSize / 1024 / 1024)} MB.` }, { status: 413 });

  const path = `${folder}/${randomUUID()}.${ext}`;
  const supabase = await createClient();

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (upErr) return NextResponse.json({ ok: false, error: "No se pudo subir el archivo." }, { status: 500 });

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  await supabase.schema("pinceles").from("media_assets").insert({
    file_name: path.split("/").pop() ?? path,
    original_name: file.name,
    storage_path: path,
    public_url: publicUrl,
    media_type: kind,
    mime_type: file.type,
    file_size: file.size,
    alt_text: altText || null,
    folder,
    uploaded_by: admin.id,
  });

  return NextResponse.json({ ok: true, url: publicUrl, path });
}
