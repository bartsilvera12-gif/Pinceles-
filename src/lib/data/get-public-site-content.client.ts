import { createClient } from "@/lib/supabase/client";
import type {
  SiteSettings,
  SiteSection,
  NavigationItem,
  HeroContent,
  TrustItem,
  Service,
  AboutContent,
  CompanyValue,
  Statistic,
  ProcessStep,
  ProjectCategory,
  ProjectWithRelations,
  Industry,
  Differentiator,
  Testimonial,
  GalleryItem,
  CtaContent,
  SocialLink,
  FooterLink,
} from "@/types/database.types";
import type { PublicSiteContent } from "./get-public-site-content";

/**
 * Versión client-side de {@link getPublicSiteContent}. Usa el cliente de
 * navegador (anon key + RLS), de modo que el sitio público lee el contenido
 * EN VIVO desde Supabase — los cambios del panel se reflejan sin rebuild,
 * también en el export estático de Hostinger.
 */
export async function getPublicSiteContentClient(): Promise<PublicSiteContent> {
  const supabase = createClient(); // schema por defecto: pinceles

  const [
    settings,
    sections,
    navigation,
    hero,
    trust,
    services,
    about,
    values,
    statistics,
    process,
    categories,
    projects,
    industries,
    differentiators,
    testimonials,
    gallery,
    cta,
    social,
    footerLinks,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("site_sections").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("navigation_items").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("hero_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    supabase.from("trust_items").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("services").select("*").eq("is_visible", true).eq("status", "published").order("sort_order"),
    supabase.from("about_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    supabase.from("company_values").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("statistics").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("process_steps").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("project_categories").select("*").eq("is_visible", true).order("sort_order"),
    supabase
      .from("projects")
      .select("*, category:project_categories(*), images:project_images(*)")
      .eq("is_visible", true)
      .eq("status", "published")
      .order("sort_order"),
    supabase.from("industries").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("differentiators").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("testimonials").select("*").eq("is_visible", true).eq("status", "published").order("sort_order"),
    supabase.from("gallery_items").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("cta_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("footer_links").select("*").eq("is_visible", true).order("sort_order"),
  ]);

  const sectionMap: Record<string, SiteSection> = {};
  for (const sec of (sections.data as SiteSection[] | null) ?? []) {
    sectionMap[sec.section_key] = sec;
  }

  const projectList = (projects.data as ProjectWithRelations[] | null) ?? [];
  for (const p of projectList) {
    if (Array.isArray(p.images)) {
      p.images.sort((a, b) => a.sort_order - b.sort_order);
    }
  }

  return {
    settings: (settings.data as SiteSettings | null) ?? null,
    sections: sectionMap,
    navigation: (navigation.data as NavigationItem[] | null) ?? [],
    hero: (hero.data as HeroContent | null) ?? null,
    trust: (trust.data as TrustItem[] | null) ?? [],
    services: (services.data as Service[] | null) ?? [],
    about: (about.data as AboutContent | null) ?? null,
    values: (values.data as CompanyValue[] | null) ?? [],
    statistics: (statistics.data as Statistic[] | null) ?? [],
    process: (process.data as ProcessStep[] | null) ?? [],
    categories: (categories.data as ProjectCategory[] | null) ?? [],
    projects: projectList,
    industries: (industries.data as Industry[] | null) ?? [],
    differentiators: (differentiators.data as Differentiator[] | null) ?? [],
    testimonials: (testimonials.data as Testimonial[] | null) ?? [],
    gallery: (gallery.data as GalleryItem[] | null) ?? [],
    cta: (cta.data as CtaContent | null) ?? null,
    social: (social.data as SocialLink[] | null) ?? [],
    footerLinks: (footerLinks.data as FooterLink[] | null) ?? [],
  };
}
