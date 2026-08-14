import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { IntroVideoBanner } from "@/components/admin/IntroVideoBanner";
import type { GalleryItem, SiteSettings } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const [items, settings] = await Promise.all([
    supabase.schema("pinceles").from("gallery_items").select("*").order("sort_order", { ascending: true }),
    supabase.schema("pinceles").from("site_settings").select("intro_video_url, intro_video_is_embed").limit(1).maybeSingle(),
  ]);
  const s = settings.data as Pick<SiteSettings, "intro_video_url" | "intro_video_is_embed"> | null;
  const list = (items.data as GalleryItem[] | null) ?? [];

  return (
    <div>
      <PageHeader title="Galería" subtitle="Video de portada, imágenes y videos que se muestran en la home." />
      <IntroVideoBanner
        url={s?.intro_video_url ?? null}
        isEmbed={s?.intro_video_is_embed ?? false}
        videos={list.filter((i) => i.media_type === "video")}
      />
      <GalleryEditor items={list} />
    </div>
  );
}
