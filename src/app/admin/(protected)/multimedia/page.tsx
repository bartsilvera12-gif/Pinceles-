import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import type { MediaAsset } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("pinceles")
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Multimedia" subtitle="Subí imágenes y copiá su URL para usarlas en el contenido." />
      <MediaLibrary assets={(data as MediaAsset[] | null) ?? []} />
    </div>
  );
}
