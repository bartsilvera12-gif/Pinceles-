import { PageHeader } from "@/components/admin/PageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { getCollectionRows } from "@/lib/admin/fetch";
import { COLLECTIONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";
const KEY = "services";

export default async function Page() {
  const rows = await getCollectionRows(KEY);
  const c = COLLECTIONS[KEY]!;
  return (
    <div>
      <PageHeader title={c.title} subtitle={c.subtitle} />
      <CollectionEditor collectionKey={KEY} rows={rows} />
    </div>
  );
}
