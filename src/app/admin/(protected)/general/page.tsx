import { redirect } from "next/navigation";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/auth/get-admin";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default async function Page() {
  const admin = await getCurrentAdmin();
  if (!isSuperAdmin(admin)) redirect("/admin");
  return <ComingSoon title="Configuración general" note="Datos de la empresa, colores y ajustes globales (solo super admin)." />;
}
