import { getPublicSiteContent } from "@/lib/data/get-public-site-content";
import { HomeLive } from "@/components/site/HomeLive";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getPublicSiteContent();
  return <HomeLive initialContent={c} />;
}
