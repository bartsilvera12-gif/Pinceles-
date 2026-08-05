"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2, Star } from "lucide-react";
import { projectSchema, type ProjectInput, type ProjectImageInput, type ProjectFormValues } from "@/lib/validations/project";
import { createProjectAction, updateProjectAction } from "@/lib/actions/admin/projects";
import { slugify } from "@/lib/utils";
import type { ProjectCategory } from "@/types/database.types";

const inp: React.CSSProperties = { width: "100%", minHeight: 46, padding: "11px 13px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };
const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 };
const errS: React.CSSProperties = { display: "block", marginTop: 5, fontSize: 12, fontWeight: 600, color: "#b23b2f" };
const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 16, padding: 22 };

export function ProjectForm({
  categories,
  initial,
  projectId,
}: {
  categories: ProjectCategory[];
  initial?: Partial<ProjectInput>;
  projectId?: string;
}) {
  const router = useRouter();
  const [images, setImages] = useState<ProjectImageInput[]>(initial?.images ?? []);
  const [newUrl, setNewUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues, unknown, ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      categoryId: initial?.categoryId ?? "",
      shortDescription: initial?.shortDescription ?? "",
      fullDescription: initial?.fullDescription ?? "",
      clientName: initial?.clientName ?? "",
      location: initial?.location ?? "",
      completionDate: initial?.completionDate ?? "",
      status: initial?.status ?? "draft",
      isFeatured: initial?.isFeatured ?? false,
      isVisible: initial?.isVisible ?? true,
      seoTitle: initial?.seoTitle ?? "",
      seoDescription: initial?.seoDescription ?? "",
      coverImageUrl: initial?.coverImageUrl ?? "",
      coverImageAlt: initial?.coverImageAlt ?? "",
      images: initial?.images ?? [],
    },
  });

  const onTitleBlur = () => {
    if (!getValues("slug") && getValues("title")) setValue("slug", slugify(getValues("title")));
  };

  const addImage = () => {
    const url = newUrl.trim();
    if (!url) return;
    setImages((prev) => {
      const next = [...prev, { imageUrl: url, altText: "", caption: "", isCover: prev.length === 0, sortOrder: prev.length }];
      return next;
    });
    setNewUrl("");
  };
  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i).map((im, idx) => ({ ...im, sortOrder: idx })));
  const move = (i: number, dir: number) =>
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next.map((im, idx) => ({ ...im, sortOrder: idx }));
    });
  const setCover = (i: number) => setImages((prev) => prev.map((im, idx) => ({ ...im, isCover: idx === i })));
  const setAlt = (i: number, v: string) => setImages((prev) => prev.map((im, idx) => (idx === i ? { ...im, altText: v } : im)));

  const onSubmit = async (values: ProjectInput) => {
    const cover = images.find((im) => im.isCover) ?? images[0];
    const payload: ProjectInput = {
      ...values,
      images,
      coverImageUrl: values.coverImageUrl || cover?.imageUrl || "",
      coverImageAlt: values.coverImageAlt || cover?.altText || "",
    };
    const res = projectId ? await updateProjectAction(projectId, payload) : await createProjectAction(payload);
    if (!res.ok) {
      toast.error(res.error ?? "No se pudo guardar.");
      return;
    }
    toast.success(projectId ? "Proyecto actualizado." : "Proyecto creado.");
    router.push("/admin/proyectos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }} className="pf-grid">
        <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
          <label>
            <span style={lbl}>Título *</span>
            <input {...register("title")} onBlur={onTitleBlur} style={inp} />
            {errors.title && <span style={errS}>{errors.title.message}</span>}
          </label>
          <label>
            <span style={lbl}>Slug *</span>
            <input {...register("slug")} style={inp} />
            {errors.slug && <span style={errS}>{errors.slug.message}</span>}
          </label>
          <label>
            <span style={lbl}>Descripción corta</span>
            <textarea {...register("shortDescription")} rows={2} style={{ ...inp, resize: "vertical" }} />
          </label>
          <label>
            <span style={lbl}>Descripción completa</span>
            <textarea {...register("fullDescription")} rows={5} style={{ ...inp, resize: "vertical" }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <span style={lbl}>Cliente</span>
              <input {...register("clientName")} style={inp} />
            </label>
            <label>
              <span style={lbl}>Ubicación</span>
              <input {...register("location")} style={inp} />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
            <label>
              <span style={lbl}>Categoría</span>
              <select {...register("categoryId")} style={inp} defaultValue={initial?.categoryId ?? ""}>
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span style={lbl}>Estado</span>
              <select {...register("status")} style={inp}>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </label>
            <label>
              <span style={lbl}>Fecha de finalización</span>
              <input type="date" {...register("completionDate")} style={inp} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" {...register("isFeatured")} /> Destacado
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" {...register("isVisible")} /> Visible
            </label>
          </div>

          <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>SEO</span>
            <input {...register("seoTitle")} placeholder="Título SEO" style={inp} />
            <textarea {...register("seoDescription")} rows={2} placeholder="Descripción SEO" style={{ ...inp, resize: "vertical" }} />
          </div>
        </div>
      </div>

      {/* Galería */}
      <div style={{ ...card }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Imágenes del proyecto</span>
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="/images/archivo.jpeg o URL" style={inp} />
          <button type="button" onClick={addImage} style={{ padding: "0 18px", borderRadius: 10, border: "none", background: "#050505", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Agregar
          </button>
        </div>
        {images.length === 0 && <p style={{ margin: 0, fontSize: 13, color: "#8a8a8a" }}>Sin imágenes. Agregá al menos una para la portada.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {images.map((im, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(5,5,5,.1)", borderRadius: 12, padding: 10 }}>
              <div style={{ position: "relative", width: 64, height: 48, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#eee" }}>
                <Image src={im.imageUrl} alt={im.altText || ""} fill sizes="64px" style={{ objectFit: "cover" }} />
              </div>
              <input value={im.altText ?? ""} onChange={(e) => setAlt(i, e.target.value)} placeholder="Texto alternativo" style={{ ...inp, minHeight: 40 }} />
              <button type="button" title="Marcar portada" onClick={() => setCover(i)} style={iconBtn(im.isCover)}>
                <Star size={16} fill={im.isCover ? "#D9912F" : "none"} />
              </button>
              <button type="button" title="Subir" onClick={() => move(i, -1)} style={iconBtn(false)}><ArrowUp size={16} /></button>
              <button type="button" title="Bajar" onClick={() => move(i, 1)} style={iconBtn(false)}><ArrowDown size={16} /></button>
              <button type="button" title="Quitar" onClick={() => removeImage(i)} style={iconBtn(false)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="button" onClick={() => router.back()} style={{ padding: "12px 22px", borderRadius: 12, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} style={{ padding: "12px 26px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: isSubmitting ? "wait" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? "Guardando…" : projectId ? "Guardar cambios" : "Crear proyecto"}
        </button>
      </div>

      <input type="hidden" {...register("coverImageUrl")} />
      <input type="hidden" {...register("coverImageAlt")} />

      <style>{`@media (max-width: 820px){ .pf-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </form>
  );
}

function iconBtn(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 10,
    border: `1px solid ${active ? "#D9912F" : "rgba(5,5,5,.16)"}`,
    background: active ? "rgba(217,145,47,.12)" : "#fff",
    color: "#050505",
    cursor: "pointer",
  };
}
