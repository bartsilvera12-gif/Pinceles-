import { redirect } from "next/navigation";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/auth/get-admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { getSingletonRow } from "@/lib/admin/fetch";
import { SINGLETONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";
const KEY = "contact_settings";

export default async function Page() {
  const admin = await getCurrentAdmin();
  if (!isSuperAdmin(admin)) redirect("/admin");
  const row = await getSingletonRow(KEY);
  const c = SINGLETONS[KEY]!;
  return (
    <div>
      <PageHeader title={c.title} subtitle={c.subtitle} />
      <SingletonEditor singletonKey={KEY} initial={row} />
    </div>
  );
}
