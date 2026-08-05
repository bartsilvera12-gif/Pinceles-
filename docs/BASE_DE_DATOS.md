# Base de datos — schema `pinceles`

Todo el contenido y la administración viven en el schema **`pinceles`** (nunca en
`public`). Los schemas del sistema (`auth`, `storage`, `extensions`) son de Supabase.

## Enums

| Enum | Valores |
|---|---|
| `admin_role` | `super_admin`, `editor` |
| `publication_status` | `draft`, `published`, `archived` |
| `lead_status` | `nuevo`, `contactado`, `cotizado`, `aprobado`, `cerrado`, `descartado` |
| `media_type` | `image`, `video`, `document` |

## Funciones

| Función | Rol |
|---|---|
| `pinceles.set_updated_at()` | Trigger `updated_at` (SECURITY INVOKER). |
| `pinceles.is_admin()` | `true` si `auth.uid()` es admin activo (SECURITY DEFINER, `search_path=''`). |
| `pinceles.is_super_admin()` | `true` si es super_admin activo. |
| `pinceles.current_admin_role()` | Rol del admin actual o `NULL`. |
| `pinceles.protect_last_super_admin()` | Impide borrar/desactivar el último super_admin. |

## Tablas (24)

`admin_profiles`, `site_settings`, `site_sections`, `navigation_items`,
`hero_content`, `trust_items`, `services`, `about_content`, `company_values`,
`statistics`, `process_steps`, `project_categories`, `projects`, `project_images`,
`industries`, `differentiators`, `testimonials`, `cta_content`, `social_links`,
`footer_links`, `legal_pages`, `contact_submissions`, `media_assets`, `audit_logs`.

Todas tienen `id uuid` (PK), `created_at`/`updated_at` (con trigger), índices en
`slug`, `sort_order`, `status`, FKs y `created_at` según corresponda.

### Relaciones clave

- `admin_profiles.id` → `auth.users(id)` `on delete cascade`.
- `projects.category_id` → `project_categories(id)`.
- `project_images.project_id` → `projects(id)` **`on delete cascade`**.
- `contact_submissions.service_id` → `services(id)`; `assigned_to` → `admin_profiles(id)`.
- Singletons (`site_settings`, `hero_content`, `about_content`, `cta_content`)
  garantizan fila única con `is_singleton boolean unique`.
- `project_images`: índice único parcial `where is_cover` → **una sola portada** por proyecto.

## RLS (resumen)

- **Público (anon/authenticated):** solo `SELECT` de contenido `is_visible`
  y (donde aplica) `status = 'published'`. Sin acceso a `admin_profiles`,
  `audit_logs`, `contact_submissions` ni notas internas.
- **Admins activos (`is_admin()`):** CRUD del contenido y lectura/gestión de solicitudes.
- **Solo super_admin (`is_super_admin()`):** gestión de usuarios, `site_settings`
  (config crítica) y lectura de `audit_logs`.
- Nadie cambia su propio rol ni se reactiva a sí mismo (políticas + triggers).
- `contact_submissions` se inserta desde la Route Handler `/api/contact` con
  service_role (no hay política pública de `INSERT`).

## Storage

Bucket **`pinceles-media`** (público de lectura, máx. 8 MB, MIME:
JPG/PNG/WebP/AVIF). Subida/edición: admins activos; borrado: super_admin u owner.
Carpetas sugeridas: `hero/`, `about/`, `projects/`, `testimonials/`, `general/`.

## Auditoría

`audit_logs` registra creación, edición, borrado, publicación, login/logout y
cambios de rol. No es editable desde el panel (solo lectura para super_admin).
