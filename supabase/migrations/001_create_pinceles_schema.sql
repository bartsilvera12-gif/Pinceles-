-- ============================================================================
-- Pinceles — Migración 001: schema `pinceles`
-- Crea el schema, enums, funciones de seguridad, tablas, índices, triggers y RLS.
-- Idempotente en lo posible (IF NOT EXISTS / CREATE OR REPLACE / drop-create policy).
-- ============================================================================

-- No validar cuerpos de función al crearlas: algunas referencian tablas que se
-- crean más abajo en el mismo archivo (igual que hace pg_dump).
set check_function_bodies = off;

create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists citext;         -- emails case-insensitive

-- ----------------------------------------------------------------------------
-- SCHEMA
-- ----------------------------------------------------------------------------
create schema if not exists pinceles;
comment on schema pinceles is 'Contenido y administración del sitio Pinceles.';

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='admin_role' and n.nspname='pinceles') then
    create type pinceles.admin_role as enum ('super_admin','editor');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='publication_status' and n.nspname='pinceles') then
    create type pinceles.publication_status as enum ('draft','published','archived');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='lead_status' and n.nspname='pinceles') then
    create type pinceles.lead_status as enum ('nuevo','contactado','cotizado','aprobado','cerrado','descartado');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='media_type' and n.nspname='pinceles') then
    create type pinceles.media_type as enum ('image','video','document');
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- FUNCIONES
-- ----------------------------------------------------------------------------

-- Trigger genérico de updated_at (SECURITY INVOKER: no necesita privilegios).
create or replace function pinceles.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
comment on function pinceles.set_updated_at() is 'Setea updated_at = now() en cada UPDATE.';

-- ¿El usuario autenticado es un administrador activo?
create or replace function pinceles.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from pinceles.admin_profiles p
    where p.id = auth.uid() and p.is_active = true
  );
$$;
comment on function pinceles.is_admin() is 'True si auth.uid() es un admin_profile activo.';

-- ¿Es super_admin activo?
create or replace function pinceles.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from pinceles.admin_profiles p
    where p.id = auth.uid() and p.is_active = true and p.role = 'super_admin'
  );
$$;
comment on function pinceles.is_super_admin() is 'True si auth.uid() es super_admin activo.';

-- Rol del admin actual (o NULL si no es admin).
create or replace function pinceles.current_admin_role()
returns pinceles.admin_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from pinceles.admin_profiles p
  where p.id = auth.uid() and p.is_active = true;
$$;
comment on function pinceles.current_admin_role() is 'Rol del admin autenticado o NULL.';

-- Permisos mínimos de ejecución
revoke all on function pinceles.is_admin() from public;
revoke all on function pinceles.is_super_admin() from public;
revoke all on function pinceles.current_admin_role() from public;
grant execute on function pinceles.is_admin() to authenticated;
grant execute on function pinceles.is_super_admin() to authenticated;
grant execute on function pinceles.current_admin_role() to authenticated;

-- ----------------------------------------------------------------------------
-- TABLAS
-- ----------------------------------------------------------------------------

-- 1. admin_profiles ----------------------------------------------------------
create table if not exists pinceles.admin_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null check (length(trim(full_name)) > 0),
  email         citext not null unique,
  role          pinceles.admin_role not null default 'editor',
  avatar_url    text,
  is_active     boolean not null default true,
  last_login_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table pinceles.admin_profiles is 'Perfiles administrativos (1:1 con auth.users). No guarda contraseñas.';

-- 2. site_settings (singleton) ----------------------------------------------
create table if not exists pinceles.site_settings (
  id                        uuid primary key default gen_random_uuid(),
  company_name              text not null default 'Pinceles',
  slogan                    text,
  short_description         text,
  logo_url                  text,
  logo_alt                  text,
  favicon_url               text,
  phone_display             text,
  whatsapp_number           text,            -- formato internacional sin espacios (ej. 595982897118)
  whatsapp_default_message  text,
  email                     citext,
  address                   text,
  city                      text,
  country                   text,
  coverage                  text,
  business_hours            text,
  map_url                   text,
  copyright_text            text,
  primary_color             text default '#D9912F',
  secondary_color           text default '#DEB97F',
  background_color          text default '#F8F6F1',
  dark_color                text default '#050505',
  is_singleton              boolean not null default true unique,   -- garantiza fila única
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  updated_by                uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.site_settings is 'Configuración general del sitio (fila única).';

-- 3. site_sections -----------------------------------------------------------
create table if not exists pinceles.site_sections (
  id               uuid primary key default gen_random_uuid(),
  section_key      text not null unique,
  internal_name    text not null,
  eyebrow          text,
  title            text,
  highlighted_text text,
  description      text,
  is_visible       boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  updated_by       uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.site_sections is 'Control de visibilidad/orden y textos de cada sección.';

-- 4. navigation_items --------------------------------------------------------
create table if not exists pinceles.navigation_items (
  id           uuid primary key default gen_random_uuid(),
  label        text not null,
  href         text not null,
  is_external  boolean not null default false,
  open_new_tab boolean not null default false,
  is_visible   boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table pinceles.navigation_items is 'Ítems del menú de navegación.';

-- 5. hero_content (singleton) ------------------------------------------------
create table if not exists pinceles.hero_content (
  id                    uuid primary key default gen_random_uuid(),
  eyebrow               text,
  title_before_highlight text,
  highlighted_text      text,
  title_after_highlight text,
  description           text,
  image_url             text,
  image_alt             text,
  image_badge           text,
  primary_button_text   text,
  primary_button_url    text,
  secondary_button_text text,
  secondary_button_url  text,
  is_visible            boolean not null default true,
  is_singleton          boolean not null default true unique,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  updated_by            uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.hero_content is 'Contenido del hero (fila única).';

-- 6. trust_items -------------------------------------------------------------
create table if not exists pinceles.trust_items (
  id         uuid primary key default gen_random_uuid(),
  icon       text,
  title      text not null,
  subtitle   text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table pinceles.trust_items is 'Barra de confianza (badges bajo el hero).';

-- 7. services ----------------------------------------------------------------
create table if not exists pinceles.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  icon              text,
  title             text not null,
  short_description text,
  full_description  text,
  image_url         text,
  image_alt         text,
  button_text       text,
  button_url        text,
  status            pinceles.publication_status not null default 'published',
  is_featured       boolean not null default false,
  is_visible        boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.services is 'Servicios ofrecidos.';

-- 8. about_content (singleton) ----------------------------------------------
create table if not exists pinceles.about_content (
  id                    uuid primary key default gen_random_uuid(),
  eyebrow               text,
  title                 text,
  description           text,
  primary_image_url     text,
  primary_image_alt     text,
  secondary_image_url   text,
  secondary_image_alt   text,
  is_visible            boolean not null default true,
  is_singleton          boolean not null default true unique,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  updated_by            uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.about_content is 'Sección Nosotros (fila única).';

-- 9. company_values ----------------------------------------------------------
create table if not exists pinceles.company_values (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon        text,
  description text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table pinceles.company_values is 'Valores de la empresa (chips en Nosotros).';

-- 10. statistics -------------------------------------------------------------
create table if not exists pinceles.statistics (
  id         uuid primary key default gen_random_uuid(),
  value      text not null,
  label      text not null,
  icon       text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table pinceles.statistics is 'Cifras/estadísticas editables.';

-- 11. process_steps ----------------------------------------------------------
create table if not exists pinceles.process_steps (
  id          uuid primary key default gen_random_uuid(),
  step_number text,
  title       text not null,
  description text,
  icon        text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table pinceles.process_steps is 'Pasos del proceso de trabajo.';

-- 12. project_categories -----------------------------------------------------
create table if not exists pinceles.project_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table pinceles.project_categories is 'Categorías de proyectos.';

-- 13. projects ---------------------------------------------------------------
create table if not exists pinceles.projects (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references pinceles.project_categories(id) on delete set null,
  slug              text not null unique,
  title             text not null,
  short_description text,
  full_description  text,
  client_name       text,
  location          text,
  completion_date   date,
  cover_image_url   text,
  cover_image_alt   text,
  status            pinceles.publication_status not null default 'published',
  is_featured       boolean not null default false,
  is_visible        boolean not null default true,
  sort_order        integer not null default 0,
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references pinceles.admin_profiles(id) on delete set null,
  updated_by        uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.projects is 'Proyectos realizados (galería).';

-- 14. project_images ---------------------------------------------------------
create table if not exists pinceles.project_images (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references pinceles.projects(id) on delete cascade,
  image_url    text not null,
  storage_path text,
  alt_text     text,
  caption      text,
  is_cover     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table pinceles.project_images is 'Imágenes de cada proyecto (cascade al borrar proyecto).';
-- Una sola portada por proyecto
create unique index if not exists uq_project_single_cover
  on pinceles.project_images(project_id) where is_cover;

-- 15. industries -------------------------------------------------------------
create table if not exists pinceles.industries (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  icon        text,
  name        text not null,
  description text,
  image_url   text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table pinceles.industries is 'Industrias/clientes a los que se atiende.';

-- 16. differentiators --------------------------------------------------------
create table if not exists pinceles.differentiators (
  id           uuid primary key default gen_random_uuid(),
  number_label text,
  icon         text,
  title        text not null,
  description  text,
  is_visible   boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table pinceles.differentiators is 'Diferenciales (¿por qué elegirnos?).';

-- 17. testimonials -----------------------------------------------------------
create table if not exists pinceles.testimonials (
  id             uuid primary key default gen_random_uuid(),
  client_name    text not null,
  client_company text,
  project_type   text,
  testimonial    text not null,
  rating         integer check (rating between 1 and 5),
  avatar_url     text,
  status         pinceles.publication_status not null default 'draft',
  is_visible     boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table pinceles.testimonials is 'Testimonios de clientes (no se muestran hasta estar publicados+visibles).';

-- 18. cta_content (singleton) ------------------------------------------------
create table if not exists pinceles.cta_content (
  id                    uuid primary key default gen_random_uuid(),
  eyebrow               text,
  title                 text,
  highlighted_text      text,
  description           text,
  primary_button_text   text,
  primary_button_url    text,
  secondary_button_text text,
  secondary_button_url  text,
  background_image_url  text,
  is_visible            boolean not null default true,
  is_singleton          boolean not null default true unique,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table pinceles.cta_content is 'Bloque CTA (fila única).';

-- 19. social_links -----------------------------------------------------------
create table if not exists pinceles.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  url        text not null,
  icon       text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table pinceles.social_links is 'Enlaces a redes sociales.';

-- 20. footer_links -----------------------------------------------------------
create table if not exists pinceles.footer_links (
  id          uuid primary key default gen_random_uuid(),
  group_name  text not null,
  label       text not null,
  url         text not null,
  is_external boolean not null default false,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table pinceles.footer_links is 'Enlaces del footer agrupados.';

-- 21. legal_pages ------------------------------------------------------------
create table if not exists pinceles.legal_pages (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  content         text,
  status          pinceles.publication_status not null default 'published',
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  updated_by      uuid references pinceles.admin_profiles(id) on delete set null
);
comment on table pinceles.legal_pages is 'Páginas legales (privacidad, términos).';

-- 22. contact_submissions ----------------------------------------------------
create table if not exists pinceles.contact_submissions (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  company               text,
  phone                 text not null,
  email                 citext,
  service_id            uuid references pinceles.services(id) on delete set null,
  service_name_snapshot text,
  location              text,
  message               text,
  source                text default 'web',
  status                pinceles.lead_status not null default 'nuevo',
  internal_notes        text,
  assigned_to           uuid references pinceles.admin_profiles(id) on delete set null,
  contacted_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table pinceles.contact_submissions is 'Solicitudes de presupuesto (se guardan antes de abrir WhatsApp).';

-- 23. media_assets -----------------------------------------------------------
create table if not exists pinceles.media_assets (
  id            uuid primary key default gen_random_uuid(),
  file_name     text not null,
  original_name text,
  storage_path  text not null,
  public_url    text,
  media_type    pinceles.media_type not null default 'image',
  mime_type     text,
  file_size     bigint,
  width         integer,
  height        integer,
  alt_text      text,
  folder        text default 'general',
  uploaded_by   uuid references pinceles.admin_profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table pinceles.media_assets is 'Biblioteca multimedia (metadatos de archivos en Storage).';

-- 24. audit_logs -------------------------------------------------------------
create table if not exists pinceles.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid references pinceles.admin_profiles(id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   text,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz not null default now()
);
comment on table pinceles.audit_logs is 'Bitácora de auditoría (solo lectura desde el panel).';

-- ----------------------------------------------------------------------------
-- ÍNDICES
-- ----------------------------------------------------------------------------
create index if not exists idx_services_status      on pinceles.services(status);
create index if not exists idx_services_sort        on pinceles.services(sort_order);
create index if not exists idx_projects_category    on pinceles.projects(category_id);
create index if not exists idx_projects_status      on pinceles.projects(status);
create index if not exists idx_projects_sort        on pinceles.projects(sort_order);
create index if not exists idx_projects_featured    on pinceles.projects(is_featured);
create index if not exists idx_projects_created      on pinceles.projects(created_at);
create index if not exists idx_project_images_proj  on pinceles.project_images(project_id);
create index if not exists idx_project_images_sort  on pinceles.project_images(sort_order);
create index if not exists idx_industries_sort      on pinceles.industries(sort_order);
create index if not exists idx_diff_sort            on pinceles.differentiators(sort_order);
create index if not exists idx_process_sort         on pinceles.process_steps(sort_order);
create index if not exists idx_trust_sort           on pinceles.trust_items(sort_order);
create index if not exists idx_values_sort          on pinceles.company_values(sort_order);
create index if not exists idx_stats_sort           on pinceles.statistics(sort_order);
create index if not exists idx_nav_sort             on pinceles.navigation_items(sort_order);
create index if not exists idx_footer_sort          on pinceles.footer_links(sort_order);
create index if not exists idx_social_sort          on pinceles.social_links(sort_order);
create index if not exists idx_testimonials_status  on pinceles.testimonials(status);
create index if not exists idx_contact_status       on pinceles.contact_submissions(status);
create index if not exists idx_contact_created      on pinceles.contact_submissions(created_at);
create index if not exists idx_contact_assigned     on pinceles.contact_submissions(assigned_to);
create index if not exists idx_media_folder         on pinceles.media_assets(folder);
create index if not exists idx_audit_admin          on pinceles.audit_logs(admin_id);
create index if not exists idx_audit_created        on pinceles.audit_logs(created_at);
create index if not exists idx_audit_entity         on pinceles.audit_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- TRIGGERS updated_at (en todas las tablas editables)
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'admin_profiles','site_settings','site_sections','navigation_items','hero_content',
    'trust_items','services','about_content','company_values','statistics','process_steps',
    'project_categories','projects','project_images','industries','differentiators',
    'testimonials','cta_content','social_links','footer_links','legal_pages',
    'contact_submissions','media_assets'
  ]
  loop
    execute format('drop trigger if exists trg_set_updated_at on pinceles.%I;', t);
    execute format(
      'create trigger trg_set_updated_at before update on pinceles.%I
       for each row execute function pinceles.set_updated_at();', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- PERMISOS DE SCHEMA (PostgREST usa roles anon/authenticated)
-- ----------------------------------------------------------------------------
grant usage on schema pinceles to anon, authenticated, service_role;
grant select on all tables in schema pinceles to anon, authenticated;
grant all on all tables in schema pinceles to service_role;
alter default privileges in schema pinceles grant select on tables to anon, authenticated;
alter default privileges in schema pinceles grant all on tables to service_role;
-- Escrituras de authenticated se controlan por RLS (abajo), no por GRANT amplio:
grant insert, update, delete on all tables in schema pinceles to authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'admin_profiles','site_settings','site_sections','navigation_items','hero_content',
    'trust_items','services','about_content','company_values','statistics','process_steps',
    'project_categories','projects','project_images','industries','differentiators',
    'testimonials','cta_content','social_links','footer_links','legal_pages',
    'contact_submissions','media_assets','audit_logs'
  ]
  loop
    execute format('alter table pinceles.%I enable row level security;', t);
    execute format('alter table pinceles.%I force row level security;', t);
  end loop;
end $$;

-- Helper para (re)crear políticas idempotentemente
-- (se hace con drop policy if exists + create policy manual por tabla)

-- ---- Lectura pública de contenido visible/publicado -------------------------
drop policy if exists p_public_read on pinceles.site_settings;
create policy p_public_read on pinceles.site_settings for select to anon, authenticated using (true);

drop policy if exists p_public_read on pinceles.site_sections;
create policy p_public_read on pinceles.site_sections for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.navigation_items;
create policy p_public_read on pinceles.navigation_items for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.hero_content;
create policy p_public_read on pinceles.hero_content for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.trust_items;
create policy p_public_read on pinceles.trust_items for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.services;
create policy p_public_read on pinceles.services for select to anon, authenticated using (is_visible and status = 'published');

drop policy if exists p_public_read on pinceles.about_content;
create policy p_public_read on pinceles.about_content for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.company_values;
create policy p_public_read on pinceles.company_values for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.statistics;
create policy p_public_read on pinceles.statistics for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.process_steps;
create policy p_public_read on pinceles.process_steps for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.project_categories;
create policy p_public_read on pinceles.project_categories for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.projects;
create policy p_public_read on pinceles.projects for select to anon, authenticated using (is_visible and status = 'published');

drop policy if exists p_public_read on pinceles.project_images;
create policy p_public_read on pinceles.project_images for select to anon, authenticated using (
  exists (select 1 from pinceles.projects pr
          where pr.id = project_id and pr.is_visible and pr.status = 'published')
);

drop policy if exists p_public_read on pinceles.industries;
create policy p_public_read on pinceles.industries for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.differentiators;
create policy p_public_read on pinceles.differentiators for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.testimonials;
create policy p_public_read on pinceles.testimonials for select to anon, authenticated using (is_visible and status = 'published');

drop policy if exists p_public_read on pinceles.cta_content;
create policy p_public_read on pinceles.cta_content for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.social_links;
create policy p_public_read on pinceles.social_links for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.footer_links;
create policy p_public_read on pinceles.footer_links for select to anon, authenticated using (is_visible);

drop policy if exists p_public_read on pinceles.legal_pages;
create policy p_public_read on pinceles.legal_pages for select to anon, authenticated using (status = 'published');

-- ---- Escritura de administradores (contenido) ------------------------------
-- Todas las tablas de contenido: admins activos pueden hacer todo.
do $$
declare t text;
begin
  foreach t in array array[
    'site_sections','navigation_items','hero_content','trust_items','services',
    'about_content','company_values','statistics','process_steps','project_categories',
    'projects','project_images','industries','differentiators','testimonials',
    'cta_content','social_links','footer_links','legal_pages','media_assets'
  ]
  loop
    execute format('drop policy if exists p_admin_all on pinceles.%I;', t);
    execute format(
      'create policy p_admin_all on pinceles.%I for all to authenticated
       using (pinceles.is_admin()) with check (pinceles.is_admin());', t);
  end loop;
end $$;

-- site_settings: leer todos (arriba). Escribir solo super_admin (config crítica).
drop policy if exists p_admin_write on pinceles.site_settings;
create policy p_admin_write on pinceles.site_settings for all to authenticated
  using (pinceles.is_super_admin()) with check (pinceles.is_super_admin());

-- ---- admin_profiles --------------------------------------------------------
-- Cada admin puede leer su propio perfil; los admins activos pueden leer todos.
drop policy if exists p_profiles_read on pinceles.admin_profiles;
create policy p_profiles_read on pinceles.admin_profiles for select to authenticated
  using (id = auth.uid() or pinceles.is_admin());

-- Solo super_admin puede crear/editar/eliminar perfiles (gestión de usuarios).
-- Nadie cambia su propio rol desde el cliente ni se reactiva a sí mismo:
drop policy if exists p_profiles_super_insert on pinceles.admin_profiles;
create policy p_profiles_super_insert on pinceles.admin_profiles for insert to authenticated
  with check (pinceles.is_super_admin());

drop policy if exists p_profiles_super_update on pinceles.admin_profiles;
create policy p_profiles_super_update on pinceles.admin_profiles for update to authenticated
  using (pinceles.is_super_admin())
  with check (
    pinceles.is_super_admin()
    -- impedir auto-cambio de rol / auto-reactivación
    and (id <> auth.uid()
         or (role = (select role from pinceles.admin_profiles me where me.id = auth.uid())
             and is_active = (select is_active from pinceles.admin_profiles me where me.id = auth.uid())))
  );

drop policy if exists p_profiles_super_delete on pinceles.admin_profiles;
create policy p_profiles_super_delete on pinceles.admin_profiles for delete to authenticated
  using (pinceles.is_super_admin() and id <> auth.uid());

-- Proteger el último super_admin activo (no eliminar/desactivar el último)
create or replace function pinceles.protect_last_super_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
declare remaining int;
begin
  if (tg_op = 'DELETE' and old.role = 'super_admin')
     or (tg_op = 'UPDATE' and old.role = 'super_admin'
         and (new.role <> 'super_admin' or new.is_active = false)) then
    select count(*) into remaining from pinceles.admin_profiles
      where role = 'super_admin' and is_active = true and id <> old.id;
    if remaining = 0 then
      raise exception 'No se puede eliminar/desactivar el último super_admin activo.';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;
drop trigger if exists trg_protect_last_super on pinceles.admin_profiles;
create trigger trg_protect_last_super before update or delete on pinceles.admin_profiles
  for each row execute function pinceles.protect_last_super_admin();

-- ---- contact_submissions ---------------------------------------------------
-- Sin lectura pública. Inserción vía Route Handler (service_role) — sin política anon de insert.
-- Admins pueden leer/gestionar.
drop policy if exists p_contact_admin on pinceles.contact_submissions;
create policy p_contact_admin on pinceles.contact_submissions for all to authenticated
  using (pinceles.is_admin()) with check (pinceles.is_admin());

-- ---- audit_logs ------------------------------------------------------------
-- Solo super_admin puede leer. Nadie edita/borra (inserta el service_role / definer).
drop policy if exists p_audit_read on pinceles.audit_logs;
create policy p_audit_read on pinceles.audit_logs for select to authenticated
  using (pinceles.is_super_admin());

-- ----------------------------------------------------------------------------
-- Exponer el schema a PostgREST (recargar caché)
-- ----------------------------------------------------------------------------
notify pgrst, 'reload schema';

-- FIN 001
