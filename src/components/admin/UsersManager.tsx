"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createAdminUserAction, updateAdminAction, deleteAdminAction } from "@/lib/actions/admin/users";
import type { AdminProfile, AdminRole } from "@/types/database.types";

const inp: React.CSSProperties = { minHeight: 42, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 14, width: "100%" };

export function UsersManager({ admins, currentId }: { admins: AdminProfile[]; currentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ email: "", fullName: "", password: "", role: "editor" as AdminRole });

  const create = () =>
    startTransition(async () => {
      const res = await createAdminUserAction(form);
      if (res.ok) {
        toast.success("Usuario creado.");
        setShowNew(false);
        setForm({ email: "", fullName: "", password: "", role: "editor" });
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });

  const update = (id: string, patch: { role?: AdminRole; is_active?: boolean }) =>
    startTransition(async () => {
      const res = await updateAdminAction(id, patch);
      if (res.ok) {
        toast.success("Actualizado.");
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });

  const remove = (u: AdminProfile) => {
    if (!confirm(`¿Eliminar a ${u.email}? Se borra su cuenta y acceso.`)) return;
    startTransition(async () => {
      const res = await deleteAdminAction(u.id);
      if (res.ok) {
        toast.success("Eliminado.");
        router.refresh();
      } else toast.error(res.error ?? "Error.");
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button type="button" onClick={() => setShowNew(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#050505", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: pending ? 0.6 : 1 }}>
        {admins.map((u) => {
          const self = u.id === currentId;
          return (
            <div key={u.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 12, padding: 12 }}>
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{u.full_name} {self && <span style={{ fontSize: 12, color: "#8a8a8a" }}>(vos)</span>}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#4D4D4E" }}>{u.email}</p>
              </div>
              <select value={u.role} disabled={self || pending} onChange={(e) => update(u.id, { role: e.target.value as AdminRole })} style={{ ...inp, width: "auto" }}>
                <option value="editor">Editor</option>
                <option value="super_admin">Super admin</option>
              </select>
              <button type="button" disabled={self || pending} onClick={() => update(u.id, { is_active: !u.is_active })} style={{ ...inp, width: "auto", cursor: "pointer", fontWeight: 600, color: u.is_active ? "#1f8a4c" : "#8a8a8a" }}>
                {u.is_active ? "Activo" : "Inactivo"}
              </button>
              <button type="button" disabled={self || pending} onClick={() => remove(u)} style={{ ...inp, width: "auto", cursor: "pointer", fontWeight: 600, color: "#b23b2f", borderColor: "rgba(178,59,47,.4)" }}>
                Eliminar
              </button>
            </div>
          );
        })}
      </div>

      {showNew && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,5,5,.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20 }} onClick={() => setShowNew(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 18, padding: 24, marginTop: 60 }}>
            <h2 style={{ margin: "0 0 18px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>Nuevo usuario</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Correo" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inp} />
              <input placeholder="Nombre completo" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={inp} />
              <input placeholder="Contraseña (mín. 8)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inp} />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })} style={inp}>
                <option value="editor">Editor</option>
                <option value="super_admin">Super admin</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
              <button type="button" onClick={() => setShowNew(false)} style={{ padding: "11px 20px", borderRadius: 12, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button type="button" onClick={create} disabled={pending} style={{ padding: "11px 24px", borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, cursor: "pointer" }}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
