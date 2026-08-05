"use client";

import { useActionState } from "react";
import type { AuthState } from "@/lib/auth/actions";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

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

export function AuthForm({
  action,
  redirectTo,
  mode,
}: {
  action: Action;
  redirectTo?: string;
  mode: "login" | "request-reset" | "update-password";
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, { error: null });

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      {(mode === "login" || mode === "request-reset") && (
        <label>
          <span style={labelS}>Correo</span>
          <input name="email" type="email" autoComplete="email" required placeholder="admin@pinceles.com" style={input} />
        </label>
      )}

      {mode === "login" && (
        <label>
          <span style={labelS}>Contraseña</span>
          <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" style={input} />
        </label>
      )}

      {mode === "update-password" && (
        <label>
          <span style={labelS}>Nueva contraseña</span>
          <input name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="Mínimo 8 caracteres" style={input} />
        </label>
      )}

      {state.error && (
        <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#b23b2f" }}>
          {state.error}
        </p>
      )}

      {mode === "request-reset" && !state.error && (
        <p aria-live="polite" style={{ margin: 0, fontSize: 13, color: "#4D4D4E" }}>
          Si el correo está registrado, te enviamos un enlace para restablecer la contraseña.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          minHeight: 50,
          background: "#D9912F",
          color: "#050505",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          borderRadius: 12,
          cursor: pending ? "wait" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending
          ? "Procesando…"
          : mode === "login"
            ? "Ingresar"
            : mode === "request-reset"
              ? "Enviar enlace"
              : "Guardar contraseña"}
      </button>
    </form>
  );
}
