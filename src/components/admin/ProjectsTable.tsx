"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProjectAction, setProjectStatusAction } from "@/lib/actions/admin/projects";
import type { ProjectCategory, ProjectWithRelations } from "@/types/database.types";

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14 };

export function ProjectsTable({
  projects,
  categories,
}: {
  projects: ProjectWithRelations[];
  categories: ProjectCategory[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");

  const list = useMemo(
    () =>
      projects.filter((p) => {
        if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat && p.category?.id !== cat) return false;
        if (status && p.status !== status) return false;
        return true;
      }),
    [projects, q, cat, status]
  );

  const onDelete = (id: string, title: string) => {
    if (!confirm(`¿Eliminar el proyecto “${title}”? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (res.ok) {
        toast.success("Proyecto eliminado.");
        router.refresh();
      } else toast.error(res.error ?? "No se pudo eliminar.");
    });
  };

  const toggle = (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    startTransition(async () => {
      const res = await setProjectStatusAction(id, next);
      if (res.ok) {
        toast.success(next === "published" ? "Publicado." : "Despublicado.");
        router.refresh();
      } else toast.error(res.error ?? "No se pudo cambiar el estado.");
    });
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <input placeholder="Buscar por título…" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inp, flex: "1 1 220px" }} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={inp}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={inp}>
          <option value="">Todos los estados</option>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="archived">Archivado</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: pending ? 0.6 : 1 }}>
        {list.length === 0 && <p style={{ color: "#8a8a8a" }}>No hay proyectos que coincidan.</p>}
        {list.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 14, padding: 12 }}>
            <div style={{ position: "relative", width: 72, height: 54, flexShrink: 0, borderRadius: 10, overflow: "hidden", background: "#eee" }}>
              {p.cover_image_url && <Image src={p.cover_image_url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#4D4D4E" }}>
                {p.category?.name ?? "Sin categoría"}
                {p.location ? ` · ${p.location}` : ""}
              </p>
            </div>
            <span style={badge(p.status)}>{p.status}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => toggle(p.id, p.status)} disabled={pending} style={btn}>
                {p.status === "published" ? "Despublicar" : "Publicar"}
              </button>
              <Link href={`/admin/proyectos/${p.id}`} style={{ ...btn, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Editar
              </Link>
              <button type="button" onClick={() => onDelete(p.id, p.title)} disabled={pending} style={{ ...btn, color: "#b23b2f", borderColor: "rgba(178,59,47,.4)" }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 9,
  border: "1px solid rgba(5,5,5,.16)",
  background: "#fff",
  fontSize: 13,
  fontWeight: 600,
  color: "#050505",
  cursor: "pointer",
};

function badge(status: string): React.CSSProperties {
  const map: Record<string, string> = { published: "#1f8a4c", draft: "#b8761f", archived: "#8a8a8a" };
  const color = map[status] ?? "#4d4d4e";
  return { fontSize: 12, fontWeight: 700, color, background: `${color}1a`, padding: "4px 12px", borderRadius: 999, whiteSpace: "nowrap" };
}
