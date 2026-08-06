"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/admin/spa";
import { useAuth } from "@/components/admin/spa/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { loading, admin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Si ya hay sesión admin activa, saltar directo al panel.
  useEffect(() => {
    if (!loading && admin) router.replace("/admin");
  }, [loading, admin, router]);

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

    // Validar perfil admin activo (mismo criterio que el admin dinámico).
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

    router.replace("/admin");
  };

  const field: React.CSSProperties = {
    width: "100%",
    minHeight: 48,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(5,5,5,.16)",
    background: "#fff",
    fontSize: 15,
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F8F6F1", fontFamily: "var(--font-sans)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", border: "1px solid rgba(5,5,5,.08)", borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 20px 50px rgba(5,5,5,.08)" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>Panel administrativo</p>
        <p style={{ margin: "8px 0 24px", fontSize: 14, color: "#4D4D4E" }}>Ingresá con tu cuenta para gestionar el sitio.</p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Correo</span>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" style={field} />
          </label>
          <label>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Contraseña</span>
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={field} />
          </label>

          {error && <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#b23b2f" }}>{error}</p>}

          <button
            type="submit"
            disabled={busy}
            style={{ minHeight: 52, borderRadius: 12, border: "none", background: "#D9912F", color: "#050505", fontWeight: 700, fontSize: 15, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}
          >
            {busy ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
