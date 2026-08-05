import { AuthCard } from "@/components/admin/AuthCard";
import { AuthForm } from "@/components/admin/AuthForm";
import { updatePasswordAction } from "@/lib/auth/actions";

export default function ResetPage() {
  return (
    <AuthCard title="Nueva contraseña" subtitle="Elegí una contraseña segura para tu cuenta.">
      <AuthForm action={updatePasswordAction} mode="update-password" />
    </AuthCard>
  );
}
