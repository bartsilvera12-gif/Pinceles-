/**
 * Configuración declarativa de las colecciones y singletons administrables.
 * Sirve como allowlist de tablas/columnas para las Server Actions genéricas
 * y como definición de los formularios del panel. Importable en cliente y servidor.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "slug"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "date"
  | "color"
  | "email";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
  help?: string;
}

export interface CollectionConfig {
  key: string;
  table: string;
  title: string;
  subtitle?: string;
  singular: string;
  fields: FieldDef[];
  listTitleField: string;
  listSubtitleField?: string;
  imageField?: string;
  orderable: boolean;
  hasVisible: boolean;
}

export interface SingletonConfig {
  key: string;
  table: string;
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  superOnly?: boolean;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
];

export const COLLECTIONS: Record<string, CollectionConfig> = {
  services: {
    key: "services",
    table: "services",
    title: "Servicios",
    subtitle: "Servicios que se muestran en el sitio.",
    singular: "servicio",
    listTitleField: "title",
    listSubtitleField: "short_description",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "icon", label: "Ícono (lucide)", type: "text", placeholder: "paint-roller" },
      { name: "short_description", label: "Descripción corta", type: "textarea", full: true },
      { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS },
      { name: "is_featured", label: "Destacado", type: "boolean" },
    ],
  },
  process_steps: {
    key: "process_steps",
    table: "process_steps",
    title: "Proceso",
    subtitle: "Pasos del proceso de trabajo.",
    singular: "paso",
    listTitleField: "title",
    listSubtitleField: "description",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "step_number", label: "Número", type: "text", placeholder: "01" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", full: true },
      { name: "icon", label: "Ícono (lucide)", type: "text" },
    ],
  },
  industries: {
    key: "industries",
    table: "industries",
    title: "Industrias",
    subtitle: "Industrias y clientes a los que se atiende.",
    singular: "industria",
    listTitleField: "name",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "icon", label: "Ícono (lucide)", type: "text", placeholder: "factory" },
      { name: "description", label: "Descripción", type: "textarea", full: true },
    ],
  },
  differentiators: {
    key: "differentiators",
    table: "differentiators",
    title: "Diferenciales",
    subtitle: "¿Por qué elegir Pinceles?",
    singular: "diferencial",
    listTitleField: "title",
    listSubtitleField: "description",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "number_label", label: "Número", type: "text", placeholder: "01" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", full: true },
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    title: "Testimonios",
    subtitle: "Se muestran en el sitio solo si están publicados y visibles.",
    singular: "testimonio",
    listTitleField: "client_name",
    listSubtitleField: "testimonial",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "client_name", label: "Cliente", type: "text", required: true },
      { name: "client_company", label: "Empresa", type: "text" },
      { name: "project_type", label: "Tipo de proyecto", type: "text" },
      { name: "testimonial", label: "Testimonio", type: "textarea", required: true, full: true },
      { name: "rating", label: "Calificación (1-5)", type: "number" },
      { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS },
    ],
  },
  company_values: {
    key: "company_values",
    table: "company_values",
    title: "Valores",
    subtitle: "Valores de la empresa (chips en Nosotros).",
    singular: "valor",
    listTitleField: "name",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "icon", label: "Ícono (lucide)", type: "text", placeholder: "check" },
    ],
  },
  statistics: {
    key: "statistics",
    table: "statistics",
    title: "Estadísticas",
    subtitle: "Cifras destacadas (ocultas por defecto).",
    singular: "cifra",
    listTitleField: "label",
    listSubtitleField: "value",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "value", label: "Valor", type: "text", required: true, placeholder: "+120" },
      { name: "label", label: "Etiqueta", type: "text", required: true },
    ],
  },
  trust_items: {
    key: "trust_items",
    table: "trust_items",
    title: "Barra de confianza",
    subtitle: "Badges bajo el hero.",
    singular: "ítem",
    listTitleField: "title",
    listSubtitleField: "subtitle",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "icon", label: "Ícono (lucide)", type: "text", placeholder: "badge-check" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "subtitle", label: "Subtítulo", type: "text" },
    ],
  },
  site_sections: {
    key: "site_sections",
    table: "site_sections",
    title: "Secciones",
    subtitle: "Activar/ocultar, reordenar y editar los textos de cada sección.",
    singular: "sección",
    listTitleField: "internal_name",
    listSubtitleField: "title",
    orderable: true,
    hasVisible: true,
    fields: [
      { name: "eyebrow", label: "Etiqueta superior", type: "text" },
      { name: "title", label: "Título", type: "text" },
      { name: "description", label: "Descripción", type: "textarea", full: true },
    ],
  },
};

export const SINGLETONS: Record<string, SingletonConfig> = {
  hero_content: {
    key: "hero_content",
    table: "hero_content",
    title: "Hero",
    subtitle: "Encabezado principal del sitio.",
    fields: [
      { name: "eyebrow", label: "Etiqueta superior", type: "text" },
      { name: "title_before_highlight", label: "Título (antes del resaltado)", type: "text" },
      { name: "highlighted_text", label: "Texto resaltado", type: "text" },
      { name: "title_after_highlight", label: "Título (después del resaltado)", type: "text" },
      { name: "description", label: "Descripción", type: "textarea", full: true },
      { name: "image_url", label: "Imagen", type: "image", full: true },
      { name: "image_alt", label: "Alt de la imagen", type: "text" },
      { name: "image_badge", label: "Badge sobre la imagen", type: "text" },
      { name: "primary_button_text", label: "Botón primario (texto)", type: "text" },
      { name: "primary_button_url", label: "Botón primario (URL)", type: "text" },
      { name: "secondary_button_text", label: "Botón secundario (texto)", type: "text" },
      { name: "secondary_button_url", label: "Botón secundario (URL)", type: "text" },
      { name: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  about_content: {
    key: "about_content",
    table: "about_content",
    title: "Nosotros",
    subtitle: "Sección institucional.",
    fields: [
      { name: "eyebrow", label: "Etiqueta superior", type: "text" },
      { name: "title", label: "Título", type: "text" },
      { name: "description", label: "Descripción", type: "textarea", full: true },
      { name: "primary_image_url", label: "Imagen principal", type: "image", full: true },
      { name: "primary_image_alt", label: "Alt imagen principal", type: "text" },
      { name: "secondary_image_url", label: "Imagen secundaria", type: "image", full: true },
      { name: "secondary_image_alt", label: "Alt imagen secundaria", type: "text" },
      { name: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  cta_content: {
    key: "cta_content",
    table: "cta_content",
    title: "CTA",
    subtitle: "Bloque de llamada a la acción.",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "highlighted_text", label: "Texto resaltado", type: "text" },
      { name: "description", label: "Descripción", type: "textarea", full: true },
      { name: "primary_button_text", label: "Botón primario (texto)", type: "text" },
      { name: "primary_button_url", label: "Botón primario (URL)", type: "text" },
      { name: "secondary_button_text", label: "Botón secundario (texto)", type: "text" },
      { name: "secondary_button_url", label: "Botón secundario (URL)", type: "text" },
      { name: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  contact_settings: {
    key: "contact_settings",
    table: "site_settings",
    title: "Contacto",
    subtitle: "Datos de contacto del sitio.",
    superOnly: true,
    fields: [
      { name: "phone_display", label: "Teléfono (visible)", type: "text" },
      { name: "whatsapp_number", label: "WhatsApp (internacional, sin +)", type: "text", placeholder: "595982897118" },
      { name: "whatsapp_default_message", label: "Mensaje por defecto de WhatsApp", type: "textarea", full: true },
      { name: "email", label: "Correo", type: "email" },
      { name: "address", label: "Dirección", type: "text" },
      { name: "city", label: "Ciudad", type: "text" },
      { name: "country", label: "País", type: "text" },
      { name: "coverage", label: "Cobertura", type: "text" },
      { name: "business_hours", label: "Horario", type: "text" },
      { name: "map_url", label: "URL del mapa", type: "text", full: true },
    ],
  },
  general_settings: {
    key: "general_settings",
    table: "site_settings",
    title: "Configuración general",
    subtitle: "Identidad y ajustes globales del sitio.",
    superOnly: true,
    fields: [
      { name: "company_name", label: "Nombre de la empresa", type: "text" },
      { name: "slogan", label: "Eslogan", type: "text" },
      { name: "short_description", label: "Descripción corta", type: "textarea", full: true },
      { name: "logo_url", label: "Logo", type: "image", full: true },
      { name: "logo_alt", label: "Alt del logo", type: "text" },
      { name: "favicon_url", label: "Favicon (URL)", type: "text" },
      { name: "copyright_text", label: "Texto de copyright", type: "text" },
      { name: "primary_color", label: "Color primario", type: "color" },
      { name: "secondary_color", label: "Color secundario", type: "color" },
      { name: "background_color", label: "Color de fondo", type: "color" },
      { name: "dark_color", label: "Color oscuro", type: "color" },
    ],
  },
  seo_settings: {
    key: "seo_settings",
    table: "site_settings",
    title: "SEO",
    subtitle: "Metadatos generales del sitio.",
    superOnly: true,
    fields: [
      { name: "company_name", label: "Nombre (título base)", type: "text" },
      { name: "short_description", label: "Descripción (meta description)", type: "textarea", full: true },
      { name: "logo_url", label: "Imagen Open Graph", type: "image", full: true },
      { name: "favicon_url", label: "Favicon", type: "text" },
    ],
  },
};

/** Campos numéricos y booleanos por tabla, para coerción en el servidor. */
export function fieldType(configFields: FieldDef[], name: string): FieldType | null {
  return configFields.find((f) => f.name === name)?.type ?? null;
}
