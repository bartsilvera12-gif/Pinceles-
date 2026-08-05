import { redirect } from "next/navigation";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/auth/get-admin";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default async function Page() {
  const admin = await getCurrentAdmin();
  if (!isSuperAdmin(admin)) redirect("/admin");
  return <ComingSoon title="Usuarios" note="Alta y gestión de administradores y roles (solo super admin)." />;
}
