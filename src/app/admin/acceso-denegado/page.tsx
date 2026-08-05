import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { signOutAction } from "@/lib/auth/actions";

export default function AccessDeniedPage() {
  return (
    <AuthCard
      title="Acceso denegado"
      subtitle="Tu cuenta está autenticada pero no tiene un perfil administrativo activo."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <form action={signOutAction}>
          <button
            type="submit"
            style={{ width: "100%", minHeight: 48, background: "#050505", color: "#fff", fontWeight: 700, border: "none", borderRadius: 12, cursor: "pointer" }}
          >
            Cerrar sesión
          </button>
        </form>
        <Link href="/" style={{ textAlign: "center", color: "#D9912F", fontWeight: 600 }}>
          Volver al sitio
        </Link>
      </div>
    </AuthCard>
  );
}
