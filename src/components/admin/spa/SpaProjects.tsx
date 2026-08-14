"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, X, ImagePlus, Loader2 } from "lucide-react";
import { useAuth } from "@/components/admin/spa/AuthProvider";
import { ImageUploadField } from "@/components/admin/spa/ImageUploadField";
import { uploadImage } from "@/lib/admin/spa-upload";
import {
  listProjects,
  listCategories,
  saveProject,
  deleteProject,
  setProjectStatus,
  slugify,
  type ProjectRow,
  type Category,
  type ProjectImage,
} from "@/lib/admin/spa-projects";

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14, width: "100%" };
const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 };
const btn: React.CSSProperties = { padding: "8px 12px", borderRadius: 9, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 13, fontWeight: 600, color: "#050505", cursor: "pointer" };

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  slugTouched: boolean;
  category_id: string;
  location: string;
  client_name: string;
  completion_date: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_visible: boolean;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  cover_image_alt: string;
  images: ProjectImage[];
};

function emptyForm(): FormState {
  return {
    id: null, title: "", slug: "", slugTouched: false, category_id: "", location: "", client_name: "",
    completion_date: "", status: "published", is_featured: false, is_visible: true,
    short_description: "", full_description: "", cover_image_url: "", cover_image_alt: "", images: [],
  };
}

function fromRow(p: ProjectRow): FormState {
  return {
    id: p.id, title: p.title ?? "", slug: p.slug ?? "", slugTouched: true,
    category_id: p.category_id ?? "", location: p.location ?? "", client_name: p.client_name ?? "",
    completion_date: p.completion_date ?? "", status: p.status ?? "draft",
    is_featured: !!p.is_featured, is_visible: p.is_visible !== false,
    short_description: p.short_description ?? "", full_description: p.full_description ?? "",
    cover_image_url: p.cover_image_url ?? "", cover_image_alt: p.cover_image_alt ?? "",
    images: (p.images ?? []).map((i) => ({ ...i })),
  };
}

export function SpaProjects() {
  const { admin } = useAuth();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [catF, setCatF] = useState("");
  const [statusF, setStatusF] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    const [ps, cs] = await Promise.all([listProjects(), listCategories()]);
    setRows(ps);
    setCats(cs);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const list = useMemo(
    () =>
      rows.filter((p) => {
        if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (catF && p.category_id !== catF) return false;
        if (statusF && p.status !== statusF) return false;
        return true;
      }),
    [rows, q, catF, statusF]
  );

  const save = async () => {
    if (!form) return;
    setBusy(true);
    const res = await saveProject(form.id, form, admin?.id);
    setBusy(false);
    if (res.ok) {
      toast[res.error ? "warning" : "success"](res.error ?? "Guardado.");
      setForm(null);
      reload();
    } else toast.error(res.error ?? "No se pudo guardar.");
  };

  const remove = async (p: ProjectRow) => {
    if (!confirm(`¿Eliminar el proyecto “${p.title}”? No se puede deshacer.`)) return;
    setBusy(true);
    const res = await deleteProject(p.id);
    setBusy(false);
    if (res.ok) { toast.success("Proyecto eliminado."); reload(); }
    else toast.error(res.error ?? "No se pudo eliminar.");
  };

  const toggle = async (p: ProjectRow) => {
    const next = p.status === "published" ? "draft" : "published";
    setBusy(true);
    const res = await setProjectStatus(p.id, next, admin?.id);
    setBusy(false);
    if (res.ok) { toast.success(next === "published" ? "Publicado." : "Despublicado."); reload(); }
    else toast.error(res.error ?? "No se pudo cambiar el estado.");
  };

  // Galería del formulario
  const addImage = () => setForm((f) => f && { ...f, images: [...f.images, { image_url: "", alt_text: "", caption: "", is_cover: f.images.length === 0, sort_order: f.images.length }] });
  const onGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploadingGallery(true);
    const added: ProjectImage[] = [];
    for (const file of files) {
      const res = await uploadImage(file, "projects", admin?.id);
      if (res.ok && res.url) added.push({ image_url: res.url, alt_text: "", caption: "", is_cover: false, sort_order: 0 });
      else toast.error(`${file.name}: ${res.error ?? "no se pudo subir"}`);
    }
    setUploadingGallery(false);
    if (added.length) {
      setForm((f) => f && { ...f, images: [...f.images, ...added] });
      toast.success(`${added.length} imagen(es) subida(s).`);
    }
  };
  const setImage = (i: number, patch: Partial<ProjectImage>) => setForm((f) => f && { ...f, images: f.images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)) });
  const removeImage = (i: number) => setForm((f) => f && { ...f, images: f.images.filter((_, idx) => idx !== i) });
  const moveImage = (i: number, dir: number) => setForm((f) => {
    if (!f) return f;
    const j = i + dir;
    if (j < 0 || j >= f.images.length) return f;
    const arr = [...f.images];
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    return { ...f, images: arr };
  });

  if (loading) return <p style={{ color: "#8a8a8a" }}>Cargando proyectos…</p>;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <input placeholder="Buscar por título…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inp, flex: "1 1 220px" }} />
        <select value={catF} onChange={(e) => setCatF(e.target.value)} style={{ ...inp, width: "auto" }}>
          <option value="">Todas las categorías</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={{ ...inp, width: "auto" }}>
          <option value="">Todos los estados</option>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="archived">Archivado</option>
        </select>
        <button type="button" onClick={() => setForm(emptyForm())} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
          <Plus size={16} /> Nuevo proyecto
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: busy ? 0.6 : 1 }}>
        {list.length === 0 && <p style={{ color: "#8a8a8a" }}>No hay proyectos que coincidan.</p>}
        {list.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, padding: 12 }}>
            <div style={{ position: "relative", width: 72, height: 54, flexShrink: 0, borderRadius: 10, overflow: "hidden", background: "#eee" }}>
              {p.cover_image_url && <Image src={p.cover_image_url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#4D4D4E" }}>
                {p.category?.name ?? "Sin categoría"}{p.location ? ` · ${p.location}` : ""}{p.images?.length ? ` · ${p.images.length} fotos` : ""}
              </p>
            </div>
            <span style={badge(p.status)}>{p.status}</span>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button type="button" onClick={() => toggle(p)} disabled={busy} style={btn}>{p.status === "published" ? "Despublicar" : "Publicar"}</button>
              <button type="button" onClick={() => setForm(fromRow(p))} style={{ ...btn, display: "inline-flex", alignItems: "center", gap: 6 }}><Pencil size={14} /> Editar</button>
              <button type="button" onClick={() => remove(p)} disabled={busy} style={{ ...btn, color: "#b23b2f", borderColor: "rgba(178,59,47,.4)" }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,5,5,.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20, overflowY: "auto" }} onClick={() => setForm(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "#fff", borderRadius: 18, padding: 24, margin: "30px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>{form.id ? "Editar proyecto" : "Nuevo proyecto"}</h2>
              <button type="button" onClick={() => setForm(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8a8a8a" }}><X size={22} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <label style={{ gridColumn: "1 / -1" }}>
                <span style={lbl}>Título *</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slugTouched ? form.slug : slugify(e.target.value) })} style={inp} />
              </label>
              <label>
                <span style={lbl}>Slug (URL) *</span>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value, slugTouched: true })} placeholder="tanque-vertical" style={inp} />
              </label>
              <label>
                <span style={lbl}>Categoría</span>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} style={inp}>
                  <option value="">Sin categoría</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                <span style={lbl}>Ubicación</span>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inp} />
              </label>
              <label style={{ display: "none" }}>
                <span style={lbl}>Cliente</span>
                <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} style={inp} />
              </label>
              <label style={{ display: "none" }}>
                <span style={lbl}>Estado</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })} style={inp}>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </label>
              <label style={{ display: "none" }}>
                <span style={lbl}>Fecha de finalización</span>
                <input type="date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} style={inp} />
              </label>
              <label style={{ gridColumn: "1 / -1", display: "none" }}>
                <span style={lbl}>Descripción corta</span>
                <textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} style={{ ...inp, resize: "vertical" }} />
              </label>
              <label style={{ gridColumn: "1 / -1", display: "none" }}>
                <span style={lbl}>Descripción completa</span>
                <textarea value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
              </label>
              <label style={{ gridColumn: "1 / -1" }}>
                <span style={lbl}>Imagen de portada</span>
                <ImageUploadField value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="projects" />
              </label>
              <label style={{ gridColumn: "1 / -1", display: "none" }}>
                <span style={lbl}>Alt de la portada</span>
                <input value={form.cover_image_alt} onChange={(e) => setForm({ ...form, cover_image_alt: e.target.value })} style={inp} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> Visible en el sitio
              </label>
              <label style={{ display: "none", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Destacado
              </label>
            </div>

            {/* Galería */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ ...lbl, marginBottom: 0 }}>Galería de imágenes</span>
                <span style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={uploadingGallery} style={{ ...btn, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {uploadingGallery ? <Loader2 size={14} className="pz-spin" /> : <ImagePlus size={14} />}
                    {uploadingGallery ? "Subiendo…" : "Subir imágenes"}
                  </button>
                  <button type="button" onClick={addImage} style={{ ...btn, display: "inline-flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Agregar por URL</button>
                </span>
                <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={onGalleryFiles} style={{ display: "none" }} />
              </div>
              <style>{`.pz-spin{animation:pzspin .8s linear infinite}@keyframes pzspin{to{transform:rotate(360deg)}}`}</style>
              {form.images.length === 0 && <p style={{ margin: 0, fontSize: 13, color: "#8a8a8a" }}>Sin imágenes. Pegá URLs de imágenes ya subidas.</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form.images.map((im, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(5,5,5,.1)", borderRadius: 10, padding: 8 }}>
                    <div style={{ position: "relative", width: 44, height: 34, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: "#eee" }}>
                      {im.image_url ? <Image src={im.image_url} alt="" fill sizes="44px" style={{ objectFit: "cover" }} /> : null}
                    </div>
                    <input value={im.image_url} onChange={(e) => setImage(i, { image_url: e.target.value })} placeholder="URL de la imagen" style={{ ...inp, flex: 1, minHeight: 36 }} />
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <input type="checkbox" checked={im.is_cover} onChange={(e) => setImage(i, { is_cover: e.target.checked })} /> portada
                    </label>
                    <button type="button" onClick={() => moveImage(i, -1)} style={{ ...btn, padding: 7 }}><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveImage(i, 1)} style={{ ...btn, padding: 7 }}><ArrowDown size={13} /></button>
                    <button type="button" onClick={() => removeImage(i)} style={{ ...btn, padding: 7, color: "#b23b2f" }}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 22 }}>
              <button type="button" onClick={() => setForm(null)} style={{ ...btn, padding: "11px 20px" }}>Cancelar</button>
              <button type="button" onClick={save} disabled={busy} style={{ padding: "11px 24px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
                {busy ? "Guardando…" : "Guardar proyecto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function badge(status: string): React.CSSProperties {
  const map: Record<string, string> = { published: "#1f8a4c", draft: "#b8761f", archived: "#8a8a8a" };
  const color = map[status] ?? "#4d4d4e";
  return { fontSize: 12, fontWeight: 700, color, background: `${color}1a`, padding: "4px 12px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 };
}
