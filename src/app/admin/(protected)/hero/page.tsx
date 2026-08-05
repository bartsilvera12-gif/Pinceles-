import { PageHeader } from "@/components/admin/PageHeader";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { getSingletonRow } from "@/lib/admin/fetch";
import { SINGLETONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";
const KEY = "hero_content";

export default async function Page() {
  const row = await getSingletonRow(KEY);
  const c = SINGLETONS[KEY]!;
  return (
    <div>
      <PageHeader title={c.title} subtitle={c.subtitle} />
      <SingletonEditor singletonKey={KEY} initial={row} />
    </div>
  );
}
