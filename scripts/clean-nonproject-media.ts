/**
 * scripts/clean-nonproject-media.ts
 * Deja en la Multimedia SOLO las imágenes de proyectos: elimina de Storage
 * (bucket pinceles-media) y de pinceles.media_assets todo lo que no sea folder 'projects'.
 *
 * Uso: npx tsx scripts/clean-nonproject-media.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const BUCKET = "pinceles-media";

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch { /* noop */ }
  return { ...env, ...process.env } as Record<string, string>;
}

async function main(): Promise<void> {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { console.error("✗ Faltan credenciales en .env.local"); process.exit(1); }
  const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data, error } = await sb
    .schema("pinceles")
    .from("media_assets")
    .select("id, storage_path, folder")
    .neq("folder", "projects");
  if (error) { console.error("✗ query:", error.message); process.exit(1); }

  const rows = (data as { id: string; storage_path: string; folder: string }[]) ?? [];
  console.log(`• ${rows.length} registros que NO son de proyectos`);
  if (!rows.length) { console.log("Nada que limpiar."); process.exit(0); }

  const paths = rows.map((r) => r.storage_path);
  const { error: rmErr } = await sb.storage.from(BUCKET).remove(paths);
  if (rmErr) console.warn("• remove storage:", rmErr.message);

  const { error: delErr } = await sb.schema("pinceles").from("media_assets").delete().neq("folder", "projects");
  if (delErr) { console.error("✗ delete rows:", delErr.message); process.exit(1); }

  rows.forEach((r) => console.log(`  ✗ eliminado: ${r.storage_path}`));
  console.log(`\nListo: ${rows.length} eliminados. Quedan solo las imágenes de proyectos.`);
  process.exit(0);
}

main().catch((e) => { console.error("✗", e instanceof Error ? e.message : String(e)); process.exit(1); });
