"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { getSupabase } from "@/lib/admin/spa";
import { useAuth } from "@/components/admin/spa/AuthProvider";

const input: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(5,5,5,.16)",
  background: "#ffffff",
  fontSize: 15,
};
const labelS: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 7 };

export default function LoginPage() {
  const { loading, admin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Ya logueado → al panel (recarga completa, compatible con el hosting).
  useEffect(() => {
    if (!loading && admin) window.location.href = "/admin/";
  }, [loading, admin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabase();

    const { data, error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signErr || !data.user) {
      setError("Credenciales inválidas.");
      setBusy(false);
      return;
    }
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id, is_active")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!profile || !profile.is_active) {
      await supabase.auth.signOut();
      setError("Tu cuenta no tiene acceso al panel.");
      setBusy(false);
      return;
    }
    window.location.href = "/admin/";
  };

  return (
    <AuthCard
      title="Panel administrativo"
      subtitle="Ingresá con tu cuenta para gestionar el sitio."
      footer={
        <Link href="/admin/recuperar-contrasena/" style={{ color: "#D9912F", fontWeight: 600 }}>
          ¿Olvidaste tu contraseña?
        </Link>
      }
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          <span style={labelS}>Correo</span>
          <input name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pinceles.com" style={input} />
        </label>
        <label>
          <span style={labelS}>Contraseña</span>
          <input name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={input} />
        </label>

        {error && (
          <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#b23b2f" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{ minHeight: 50, background: "#D9912F", color: "#050505", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}
        >
          {busy ? "Procesando…" : "Ingresar"}
        </button>
      </form>
    </AuthCard>
  );
}
