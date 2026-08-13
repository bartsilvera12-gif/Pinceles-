import { getPublicSiteContent } from "@/lib/data/get-public-site-content";
import { HomeRedesign } from "@/components/site/HomeRedesign";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getPublicSiteContent();
  return <HomeRedesign content={c} />;
}
