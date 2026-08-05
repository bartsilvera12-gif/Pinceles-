import { createClient } from "@/lib/supabase/server";
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
  CtaContent,
  SocialLink,
  FooterLink,
} from "@/types/database.types";

export interface PublicSiteContent {
  settings: SiteSettings | null;
  sections: Record<string, SiteSection>;
  navigation: NavigationItem[];
  hero: HeroContent | null;
  trust: TrustItem[];
  services: Service[];
  about: AboutContent | null;
  values: CompanyValue[];
  statistics: Statistic[];
  process: ProcessStep[];
  categories: ProjectCategory[];
  projects: ProjectWithRelations[];
  industries: Industry[];
  differentiators: Differentiator[];
  testimonials: Testimonial[];
  cta: CtaContent | null;
  social: SocialLink[];
  footerLinks: FooterLink[];
}

/**
 * Carga central del contenido público. Una sola función, consultas en paralelo.
 * RLS garantiza que solo llegue contenido publicado/visible.
 */
export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  const supabase = await createClient();
  const s = () => supabase.schema("pinceles");

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
    cta,
    social,
    footerLinks,
  ] = await Promise.all([
    s().from("site_settings").select("*").limit(1).maybeSingle(),
    s().from("site_sections").select("*").eq("is_visible", true).order("sort_order"),
    s().from("navigation_items").select("*").eq("is_visible", true).order("sort_order"),
    s().from("hero_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    s().from("trust_items").select("*").eq("is_visible", true).order("sort_order"),
    s()
      .from("services")
      .select("*")
      .eq("is_visible", true)
      .eq("status", "published")
      .order("sort_order"),
    s().from("about_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    s().from("company_values").select("*").eq("is_visible", true).order("sort_order"),
    s().from("statistics").select("*").eq("is_visible", true).order("sort_order"),
    s().from("process_steps").select("*").eq("is_visible", true).order("sort_order"),
    s().from("project_categories").select("*").eq("is_visible", true).order("sort_order"),
    s()
      .from("projects")
      .select("*, category:project_categories(*), images:project_images(*)")
      .eq("is_visible", true)
      .eq("status", "published")
      .order("sort_order"),
    s().from("industries").select("*").eq("is_visible", true).order("sort_order"),
    s().from("differentiators").select("*").eq("is_visible", true).order("sort_order"),
    s()
      .from("testimonials")
      .select("*")
      .eq("is_visible", true)
      .eq("status", "published")
      .order("sort_order"),
    s().from("cta_content").select("*").eq("is_visible", true).limit(1).maybeSingle(),
    s().from("social_links").select("*").eq("is_visible", true).order("sort_order"),
    s().from("footer_links").select("*").eq("is_visible", true).order("sort_order"),
  ]);

  const sectionMap: Record<string, SiteSection> = {};
  for (const sec of (sections.data as SiteSection[] | null) ?? []) {
    sectionMap[sec.section_key] = sec;
  }

  const projectImages = (projects.data as ProjectWithRelations[] | null) ?? [];
  for (const p of projectImages) {
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
    projects: projectImages,
    industries: (industries.data as Industry[] | null) ?? [],
    differentiators: (differentiators.data as Differentiator[] | null) ?? [],
    testimonials: (testimonials.data as Testimonial[] | null) ?? [],
    cta: (cta.data as CtaContent | null) ?? null,
    social: (social.data as SocialLink[] | null) ?? [],
    footerLinks: (footerLinks.data as FooterLink[] | null) ?? [],
  };
}
