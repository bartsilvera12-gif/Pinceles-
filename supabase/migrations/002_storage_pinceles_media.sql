-- ============================================================================
-- Pinceles — Migración 002: Storage bucket `pinceles-media`
-- Bucket público de lectura; escritura/edición/borrado solo para admins activos.
-- Requiere que exista pinceles.is_admin() / pinceles.is_super_admin() (migración 001).
-- ============================================================================

-- Bucket (idempotente). Público para lectura de archivos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pinceles-media',
  'pinceles-media',
  true,
  8388608, -- 8 MB
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Políticas sobre storage.objects (limitadas a este bucket) -------------------

-- Lectura pública de los archivos del bucket
drop policy if exists p_pinceles_media_public_read on storage.objects;
create policy p_pinceles_media_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'pinceles-media');

-- Subida: solo administradores activos
drop policy if exists p_pinceles_media_admin_insert on storage.objects;
create policy p_pinceles_media_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'pinceles-media' and pinceles.is_admin());

-- Actualización: solo administradores activos
drop policy if exists p_pinceles_media_admin_update on storage.objects;
create policy p_pinceles_media_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'pinceles-media' and pinceles.is_admin())
  with check (bucket_id = 'pinceles-media' and pinceles.is_admin());

-- Borrado: super_admin, o el admin que subió el archivo (owner)
drop policy if exists p_pinceles_media_admin_delete on storage.objects;
create policy p_pinceles_media_admin_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'pinceles-media'
    and (pinceles.is_super_admin() or owner = auth.uid())
  );

-- NOTA: la validación de extensión, tamaño y MIME real también se hace en la
-- Route Handler de subida (server). SVG no se acepta sin sanitización.

-- FIN 002
