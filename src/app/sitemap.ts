import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinceles.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    // La política de privacidad es una página oculta (/politicadeprivacidad):
    // no se lista en el sitemap ni se indexa.
  ];
}
