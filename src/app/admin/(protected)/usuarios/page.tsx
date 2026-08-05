import { redirect } from "next/navigation";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/auth/get-admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsersManager } from "@/components/admin/UsersManager";
import type { AdminProfile } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await getCurrentAdmin();
  if (!isSuperAdmin(me) || !me) redirect("/admin");

  const supabase = await createClient();
  const { data } = await supabase
    .schema("pinceles")
    .from("admin_profiles")
    .select("*")
    .order("created_at");

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Administradores del panel. Solo super administradores pueden gestionarlos." />
      <UsersManager admins={(data as AdminProfile[] | null) ?? []} currentId={me.id} />
    </div>
  );
}
