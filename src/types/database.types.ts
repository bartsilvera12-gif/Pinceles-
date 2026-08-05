/**
 * Tipos del schema `pinceles`.
 * Escritos a mano (podés regenerarlos con `supabase gen types` cuando quieras).
 */

export type PublicationStatus = "draft" | "published" | "archived";
export type AdminRole = "super_admin" | "editor";
export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "cotizado"
  | "aprobado"
  | "cerrado"
  | "descartado";
export type MediaType = "image" | "video" | "document";

export interface SiteSettings {
  id: string;
  company_name: string;
  slogan: string | null;
  short_description: string | null;
  logo_url: string | null;
  logo_alt: string | null;
  favicon_url: string | null;
  phone_display: string | null;
  whatsapp_number: string | null;
  whatsapp_default_message: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  coverage: string | null;
  business_hours: string | null;
  map_url: string | null;
  copyright_text: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  background_color: string | null;
  dark_color: string | null;
}

export interface SiteSection {
  id: string;
  section_key: string;
  internal_name: string;
  eyebrow: string | null;
  title: string | null;
  highlighted_text: string | null;
  description: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  is_external: boolean;
  open_new_tab: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface HeroContent {
  id: string;
  eyebrow: string | null;
  title_before_highlight: string | null;
  highlighted_text: string | null;
  title_after_highlight: string | null;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_badge: string | null;
  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  is_visible: boolean;
}

export interface TrustItem {
  id: string;
  icon: string | null;
  title: string;
  subtitle: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  slug: string;
  icon: string | null;
  title: string;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  button_url: string | null;
  status: PublicationStatus;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface AboutContent {
  id: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  primary_image_url: string | null;
  primary_image_alt: string | null;
  secondary_image_url: string | null;
  secondary_image_alt: string | null;
  is_visible: boolean;
}

export interface CompanyValue {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  icon: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  step_number: string | null;
  title: string;
  description: string | null;
  icon: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  caption: string | null;
  is_cover: boolean;
  sort_order: number;
}

export interface Project {
  id: string;
  category_id: string | null;
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  client_name: string | null;
  location: string | null;
  completion_date: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  status: PublicationStatus;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface ProjectWithRelations extends Project {
  category: ProjectCategory | null;
  images: ProjectImage[];
}

export interface Industry {
  id: string;
  slug: string;
  icon: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface Differentiator {
  id: string;
  number_label: string | null;
  icon: string | null;
  title: string;
  description: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_company: string | null;
  project_type: string | null;
  testimonial: string;
  rating: number | null;
  avatar_url: string | null;
  status: PublicationStatus;
  is_visible: boolean;
  sort_order: number;
}

export interface CtaContent {
  id: string;
  eyebrow: string | null;
  title: string | null;
  highlighted_text: string | null;
  description: string | null;
  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  background_image_url: string | null;
  is_visible: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface FooterLink {
  id: string;
  group_name: string;
  label: string;
  url: string;
  is_external: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  status: PublicationStatus;
  seo_title: string | null;
  seo_description: string | null;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  service_id: string | null;
  service_name_snapshot: string | null;
  location: string | null;
  message: string | null;
  source: string | null;
  status: LeadStatus;
  internal_notes: string | null;
  assigned_to: string | null;
  contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  original_name: string | null;
  storage_path: string;
  public_url: string | null;
  media_type: MediaType;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  folder: string | null;
}
