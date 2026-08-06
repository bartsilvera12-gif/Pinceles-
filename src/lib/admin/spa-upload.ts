// Subida de imágenes para el panel en hosting estático.
//
// El navegador NO puede subir directo a Supabase Storage (el servidor bloquea la
// subida por CORS y falta el bucket), así que subimos a un script PHP del MISMO
// dominio (public/subir-imagen.php), que guarda el archivo en /uploads/ y
// devuelve la URL pública. Sin CORS, sin claves secretas.

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const FOLDERS = new Set(["hero", "about", "projects", "testimonials", "general"]);

export type UploadResult = { ok: boolean; url?: string; error?: string };

export async function uploadImage(file: File, folder = "general", _adminId?: string): Promise<UploadResult> {
  if (!(file instanceof File)) return { ok: false, error: "Archivo faltante." };
  if (file.size > MAX_SIZE) return { ok: false, error: "El archivo supera 8 MB." };
  if (!ALLOWED.has(file.type)) return { ok: false, error: "Formato no permitido (JPG, PNG, WebP o AVIF)." };

  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", FOLDERS.has(folder) ? folder : "general");

  try {
    const r = await fetch("/subir-imagen.php", { method: "POST", body: fd });
    let json: { ok?: boolean; url?: string; error?: string } = {};
    try {
      json = await r.json();
    } catch {
      return { ok: false, error: "El servidor no devolvió una respuesta válida (¿falta subir subir-imagen.php?)." };
    }
    if (!r.ok || !json.ok || !json.url) return { ok: false, error: json.error ?? "No se pudo subir." };
    return { ok: true, url: json.url };
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor de subida." };
  }
}
