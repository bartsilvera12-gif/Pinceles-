import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import type { GalleryItem } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("pinceles")
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Galería" subtitle="Imágenes y videos que se muestran en la home." />
      <GalleryEditor items={(data as GalleryItem[] | null) ?? []} />
    </div>
  );
}
