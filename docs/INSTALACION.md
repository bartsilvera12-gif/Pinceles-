# Instalación y puesta en marcha

## Requisitos

- Node.js 20+ (probado con Node 24)
- Acceso a un proyecto Supabase (PostgreSQL + Auth + Storage)
- `psql` o la CLI de Supabase para aplicar migraciones (opcional pero recomendado)

## 1. Variables de entorno

```bash
cp .env.example .env.local
# completá los valores reales (ver .env.example)
```

`.env.local` está en `.gitignore`. **Nunca** subas secretos al repo.
La `SUPABASE_SERVICE_ROLE_KEY` va **solo** en el servidor (sin prefijo `NEXT_PUBLIC`).

## 2. Instalar dependencias

```bash
npm install
```

## 3. Aplicar migraciones y seed

Con `psql` (usando `DATABASE_URL`):

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_create_pinceles_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_storage_pinceles_media.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

O con la CLI de Supabase (`supabase db push` + `supabase db seed`) si el proyecto
está enlazado.

Luego, exponé el schema `pinceles` en PostgREST — ver
[EXPOSICION_SCHEMA_PINCELES.md](./EXPOSICION_SCHEMA_PINCELES.md).

## 4. Crear el primer administrador

Ver [CREAR_ADMIN.md](./CREAR_ADMIN.md):

```bash
npx tsx scripts/create-admin.ts
```

## 5. Ejecutar en local

```bash
npm run dev        # http://localhost:3000
```

## 6. Build de producción

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## 7. Comprobaciones

- `/` carga el contenido desde Supabase.
- `/admin/login` permite iniciar sesión.
- Las rutas `/admin/*` redirigen a login sin sesión.
- El formulario de contacto guarda en `pinceles.contact_submissions` y abre WhatsApp.
