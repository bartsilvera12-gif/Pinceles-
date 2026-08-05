import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth/get-admin";

export const runtime = "nodejs";

const BUCKET = "pinceles-media";
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const FOLDERS = new Set(["hero", "about", "projects", "testimonials", "general"]);

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "general");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "general";
  const altText = String(form.get("alt") ?? "").slice(0, 300);

  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Archivo faltante." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ ok: false, error: "El archivo supera 8 MB." }, { status: 413 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: "Formato no permitido (JPG, PNG, WebP, AVIF)." }, { status: 415 });

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
    media_type: "image",
    mime_type: file.type,
    file_size: file.size,
    alt_text: altText || null,
    folder,
    uploaded_by: admin.id,
  });

  return NextResponse.json({ ok: true, url: publicUrl, path });
}
