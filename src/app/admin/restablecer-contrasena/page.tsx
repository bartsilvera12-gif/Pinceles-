"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { getSupabase } from "@/lib/admin/spa";

const input: React.CSSProperties = { width: "100%", minHeight: 48, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(5,5,5,.16)", background: "#fff", fontSize: 15 };
const labelS: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 7 };

export default function RestablecerPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // El enlace del correo trae una sesión de recuperación en la URL; supabase-js
  // (detectSessionInUrl) la procesa. Esperamos a tener sesión para permitir el cambio.
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await getSupabase().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError("No se pudo actualizar. Pedí un nuevo enlace.");
      return;
    }
    router.replace("/admin");
  };

  return (
    <AuthCard title="Nueva contraseña" subtitle="Elegí una contraseña segura para tu cuenta.">
      {!ready ? (
        <p style={{ margin: 0, fontSize: 14, color: "#4D4D4E" }}>
          Validando el enlace… Si llegaste acá sin usar el enlace del correo, pedí uno nuevo desde “¿Olvidaste tu contraseña?”.
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            <span style={labelS}>Nueva contraseña</span>
            <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" style={input} />
          </label>
          {error && <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#b23b2f" }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ minHeight: 50, background: "#D9912F", color: "#050505", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
            {busy ? "Procesando…" : "Guardar contraseña"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
