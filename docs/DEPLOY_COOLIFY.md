# Despliegue en Coolify

La app es Next.js con `output: "standalone"` y un **Dockerfile multi-stage**, lista
para Coolify (o cualquier host de contenedores).

## 1. Imagen Docker

El `Dockerfile` tiene 3 etapas: `deps` → `builder` → `runner`. La imagen final solo
contiene el output standalone (`server.js`, `.next/static`, `public`). Puerto **3000**.

```bash
docker build -t pinceles-web .
docker run -p 3000:3000 --env-file .env.local pinceles-web
```

## 2. Variables de entorno (en Coolify → Environment)

| Variable | Notas |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública |
| `SUPABASE_SERVICE_ROLE_KEY` | **secreto**, solo servidor |
| `DATABASE_URL` | migraciones/seed y scripts |
| `NEXT_PUBLIC_SITE_URL` | dominio final (SEO, reset password) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | solo para el script de admin |

Las `NEXT_PUBLIC_*` deben existir **en build** (se inlinean). En Coolify marcá el
build con esas variables disponibles.

## 3. Dominio

- Asigná el dominio (ej. `pinceles.com.py`) al servicio en Coolify.
- Configurá `NEXT_PUBLIC_SITE_URL` con ese dominio (https).
- Coolify gestiona TLS (Let's Encrypt).

## 4. Supabase

- Si Supabase es self-hosted (`api.neura.com.py`), exponé el schema `pinceles`
  en PostgREST — ver [EXPOSICION_SCHEMA_PINCELES.md](./EXPOSICION_SCHEMA_PINCELES.md).
- El bucket `pinceles-media` debe existir (migración `002`).

## 5. Migraciones

Antes del primer deploy (o en un job de release):

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_create_pinceles_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_storage_pinceles_media.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

## 6. Healthcheck

Endpoint **`/api/health`** → responde `200` con `{ status: "ok" }` (y, si está
configurado, un chequeo liviano de Supabase). **No expone secretos.**
Configuralo como health check del contenedor en Coolify.

## 7. Redeploy

- Push a la rama configurada → Coolify reconstruye la imagen.
- Tras cambios de contenido en el panel, la web se revalida con
  `revalidatePath("/")` (no requiere redeploy).
