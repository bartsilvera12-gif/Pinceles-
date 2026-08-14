/**
 * scripts/import-media.ts
 * Importa las imágenes locales de public/images a Supabase Storage (bucket
 * `pinceles-media`) y las registra en pinceles.media_assets, para que aparezcan
 * en la Multimedia del panel. Idempotente: si ya existe el registro, lo saltea.
 *
 * Uso:  npx tsx scripts/import-media.ts
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (se leen de .env.local).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const BUCKET = "pinceles-media";
const IMAGES_DIR = "public/images";
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

// Lee .env.local sin dependencias externas.
function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    /* noop */
  }
  return { ...env, ...process.env } as Record<string, string>;
}

function folderFor(name: string): string {
  if (name.startsWith("proj-")) return "projects";
  if (name.startsWith("hero")) return "hero";
  if (name.startsWith("equipo") || name.startsWith("about")) return "about";
  return "general";
}

async function main(): Promise<void> {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("✗ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  // Bucket público (idempotente).
  const { error: bErr } = await sb.storage.createBucket(BUCKET, { public: true });
  if (bErr && !/already exists|exists/i.test(bErr.message)) {
    console.warn("• createBucket:", bErr.message);
  }

  // Un admin para uploaded_by (puede ser null si la columna lo permite).
  const { data: adminRow } = await sb.schema("pinceles").from("admin_profiles").select("id").limit(1).maybeSingle();
  const uploadedBy = (adminRow as { id: string } | null)?.id ?? null;

  const files = readdirSync(IMAGES_DIR).filter((f) => MIME[extname(f).toLowerCase()]);
  console.log(`• ${files.length} imágenes en ${IMAGES_DIR}`);

  let ok = 0, skip = 0, fail = 0;
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const mime = MIME[ext];
    const folder = folderFor(file);
    const path = `${folder}/${file}`; // conserva el nombre original

    // ¿Ya registrado?
    const { data: exists } = await sb.schema("pinceles").from("media_assets").select("id").eq("storage_path", path).maybeSingle();
    if (exists) { skip++; console.log(`  = ya existe: ${path}`); continue; }

    const bytes = readFileSync(join(IMAGES_DIR, file));
    const size = statSync(join(IMAGES_DIR, file)).size;

    const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: true });
    if (upErr) { fail++; console.error(`  ✗ upload ${path}: ${upErr.message}`); continue; }

    const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
    const { error: insErr } = await sb.schema("pinceles").from("media_assets").insert({
      file_name: basename(path),
      original_name: file,
      storage_path: path,
      public_url: pub.publicUrl,
      media_type: "image",
      mime_type: mime,
      file_size: size,
      alt_text: null,
      folder,
      uploaded_by: uploadedBy,
    });
    if (insErr) { fail++; console.error(`  ✗ insert ${path}: ${insErr.message}`); continue; }
    ok++; console.log(`  ✓ ${path}`);
  }

  console.log(`\nListo: ${ok} subidas, ${skip} ya existentes, ${fail} con error.`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("✗ Error inesperado:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
