# Pinceles — Sitio institucional + panel administrativo

Aplicación web de **Pinceles** (pintura, mantenimiento, obras y soluciones
industriales). Eslogan: *Coloreando el futuro, un trazo a la vez.*

Migrado de un sitio HTML estático a una app **Next.js 16 + Supabase** con panel
administrativo. Todo el contenido visible se administra desde `/admin` y vive en
el schema `pinceles` de PostgreSQL.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** estricto
- **Tailwind CSS v4** + `next/font` (Playfair Display + Manrope)
- **Supabase**: PostgreSQL + Auth + Storage (`@supabase/ssr`)
- React Hook Form + Zod, Lucide, Sonner
- `output: "standalone"` + Dockerfile multi-stage (deploy en Coolify)

## Puesta en marcha

```bash
cp .env.example .env.local   # completá los valores
npm install
# aplicar migraciones + seed (ver docs/INSTALACION.md)
npm run create-admin         # primer super_admin (ADMIN_EMAIL/ADMIN_PASSWORD)
npm run dev                  # http://localhost:3000  ·  panel en /admin/login
```

Verificación: `npm run lint` · `npm run typecheck` · `npm run build`.

## Documentación

| Doc | Contenido |
| --- | --- |
| [docs/INSTALACION.md](docs/INSTALACION.md) | Instalación, variables, migraciones, seed, build |
| [docs/BASE_DE_DATOS.md](docs/BASE_DE_DATOS.md) | Tablas, relaciones, RLS, Storage, roles |
| [docs/EXPOSICION_SCHEMA_PINCELES.md](docs/EXPOSICION_SCHEMA_PINCELES.md) | Exponer `pinceles` en PostgREST |
| [docs/CREAR_ADMIN.md](docs/CREAR_ADMIN.md) | Crear el primer administrador |
| [docs/DEPLOY_COOLIFY.md](docs/DEPLOY_COOLIFY.md) | Docker, variables, dominio, healthcheck |

## Estructura

```
src/app            rutas públicas + /admin (panel protegido) + /api
src/components      site/ (público) · admin/ (panel) · ui/
src/lib             supabase/ · data/ · actions/ · auth/ · admin/ · validations/
supabase/           migrations/ + seed.sql
scripts/            create-admin.ts
legacy/             sitio estático original (solo referencia)
```

Sitio estático anterior: ver [legacy/](legacy/).
