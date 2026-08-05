import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { AuthForm } from "@/components/admin/AuthForm";
import { requestPasswordResetAction } from "@/lib/auth/actions";

export default function RecoverPage() {
  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviamos un enlace para restablecerla."
      footer={
        <Link href="/admin/login" style={{ color: "#D9912F", fontWeight: 600 }}>
          Volver a ingresar
        </Link>
      }
    >
      <AuthForm action={requestPasswordResetAction} mode="request-reset" />
    </AuthCard>
  );
}
