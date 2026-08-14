/**
 * scripts/keep-used-project-media.ts
 * Deja en Multimedia SOLO las imágenes que realmente usa algún proyecto
 * (referenciadas por projects.cover_image_url o project_images.image_url).
 * Elimina de Storage + media_assets las `proj-*` que no estén asignadas a un proyecto.
 *
 * Uso: npx tsx scripts/keep-used-project-media.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const BUCKET = "pinceles-media";
const base = (u: string | null) => (u ? (u.split("/").pop() ?? "").toLowerCase() : "");

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

  // Imágenes realmente usadas por proyectos.
  const [{ data: projs }, { data: imgs }] = await Promise.all([
    sb.schema("pinceles").from("projects").select("cover_image_url"),
    sb.schema("pinceles").from("project_images").select("image_url"),
  ]);
  const used = new Set<string>();
  for (const p of (projs as { cover_image_url: string | null }[]) ?? []) { const b = base(p.cover_image_url); if (b) used.add(b); }
  for (const i of (imgs as { image_url: string | null }[]) ?? []) { const b = base(i.image_url); if (b) used.add(b); }
  console.log(`• Imágenes referenciadas por proyectos: ${used.size}`);

  // media_assets actuales.
  const { data: media } = await sb.schema("pinceles").from("media_assets").select("id, storage_path, original_name");
  const rows = (media as { id: string; storage_path: string; original_name: string | null }[]) ?? [];

  const toDelete = rows.filter((r) => !used.has((r.original_name ?? r.storage_path.split("/").pop() ?? "").toLowerCase()));
  console.log(`• En Multimedia: ${rows.length} | usadas: ${rows.length - toDelete.length} | a eliminar: ${toDelete.length}`);
  if (!toDelete.length) { console.log("Nada que eliminar."); process.exit(0); }

  const paths = toDelete.map((r) => r.storage_path);
  const { error: rmErr } = await sb.storage.from(BUCKET).remove(paths);
  if (rmErr) console.warn("• remove storage:", rmErr.message);
  const { error: delErr } = await sb.schema("pinceles").from("media_assets").delete().in("id", toDelete.map((r) => r.id));
  if (delErr) { console.error("✗ delete:", delErr.message); process.exit(1); }

  toDelete.forEach((r) => console.log(`  ✗ ${r.original_name ?? r.storage_path} (sin proyecto)`));
  console.log(`\nListo: quedan ${rows.length - toDelete.length} imágenes (solo las usadas en proyectos).`);
  process.exit(0);
}

main().catch((e) => { console.error("✗", e instanceof Error ? e.message : String(e)); process.exit(1); });
