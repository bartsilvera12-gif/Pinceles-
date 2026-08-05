import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database.types";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let settings: SiteSettings | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .schema("pinceles")
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    settings = (data as SiteSettings | null) ?? null;
  } catch {
    settings = null;
  }

  const name = settings?.company_name ?? "Pinceles";
  const title = `${name} | Pintura, Obras y Soluciones Industriales`;
  const description =
    settings?.short_description ??
    "Servicios profesionales de pintura residencial, comercial e industrial.";
  const favicon = settings?.favicon_url ?? "/images/favicon-pinceles.png";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinceles.com.py"),
    title,
    description,
    icons: { icon: favicon, apple: favicon },
    openGraph: {
      title,
      description: settings?.slogan ?? description,
      images: settings?.logo_url ? [settings.logo_url] : ["/images/logo-pinceles.jpg"],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
