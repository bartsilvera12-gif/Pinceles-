/**
 * scripts/remove-torre-media.ts
 * Elimina de Multimedia las imágenes del proyecto "torre residencial" (proj-torre*),
 * que está oculto por código en el sitio, para que la librería coincida con lo visible.
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
  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data } = await sb.schema("pinceles").from("media_assets").select("id, storage_path, original_name");
  const rows = (data as { id: string; storage_path: string; original_name: string | null }[]) ?? [];
  const torre = rows.filter((r) => /torre/i.test(r.original_name ?? r.storage_path));
  console.log(`• total actual: ${rows.length} | de torre: ${torre.length}`);
  if (!torre.length) { console.log("Nada que eliminar."); process.exit(0); }

  await sb.storage.from(BUCKET).remove(torre.map((r) => r.storage_path));
  const { error } = await sb.schema("pinceles").from("media_assets").delete().in("id", torre.map((r) => r.id));
  if (error) { console.error("✗", error.message); process.exit(1); }
  torre.forEach((r) => console.log(`  ✗ ${r.original_name}`));
  console.log(`\nListo: quedan ${rows.length - torre.length} imágenes en Multimedia.`);
  process.exit(0);
}

main().catch((e) => { console.error("✗", e instanceof Error ? e.message : String(e)); process.exit(1); });
