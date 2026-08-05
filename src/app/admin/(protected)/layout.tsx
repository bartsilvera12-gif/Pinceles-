import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/get-admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/acceso-denegado");

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
