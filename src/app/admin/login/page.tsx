import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { AuthForm } from "@/components/admin/AuthForm";
import { signInAction } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthCard
      title="Panel administrativo"
      subtitle="Ingresá con tu cuenta para gestionar el sitio."
      footer={
        <Link href="/admin/recuperar-contrasena" style={{ color: "#D9912F", fontWeight: 600 }}>
          ¿Olvidaste tu contraseña?
        </Link>
      }
    >
      <AuthForm action={signInAction} mode="login" redirectTo={redirect} />
    </AuthCard>
  );
}
