"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { getSupabase } from "@/lib/admin/spa";

const input: React.CSSProperties = { width: "100%", minHeight: 48, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 15 };
const labelS: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 7 };

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const redirectTo = `${window.location.origin}/admin/restablecer-contrasena/`;
    await getSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
    setBusy(false);
    setSent(true); // respuesta siempre igual (no revela si el correo existe)
  };

  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviamos un enlace para restablecerla."
      footer={<Link href="/admin/login" style={{ color: "#D9912F", fontWeight: 600 }}>Volver a ingresar</Link>}
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          <span style={labelS}>Correo</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pinceles.com" style={input} />
        </label>
        {sent && (
          <p aria-live="polite" style={{ margin: 0, fontSize: 13, color: "#4D4D4E" }}>
            Si el correo está registrado, te enviamos un enlace para restablecer la contraseña.
          </p>
        )}
        <button type="submit" disabled={busy} style={{ minHeight: 50, background: "#D9912F", color: "#050505", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
          {busy ? "Procesando…" : "Enviar enlace"}
        </button>
      </form>
    </AuthCard>
  );
}
