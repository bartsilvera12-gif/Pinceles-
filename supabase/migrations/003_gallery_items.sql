-- 003_gallery_items.sql
-- Galería de imágenes y videos para el sitio público.
-- Idempotente (IF NOT EXISTS / drop-create policy).

create table if not exists pinceles.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  media_type  text not null default 'image' check (media_type in ('image', 'video')),
  url         text not null,                 -- URL de imagen, de video subido, o de embed (YouTube/Vimeo)
  is_embed    boolean not null default false, -- true = video embebido (iframe); false = imagen o video subido
  poster_url  text,                          -- miniatura opcional para videos
  title       text,
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table pinceles.gallery_items is 'Galería pública: imágenes y videos (subidos o embebidos).';

alter table pinceles.gallery_items enable row level security;

grant select on pinceles.gallery_items to anon, authenticated;
grant insert, update, delete on pinceles.gallery_items to authenticated;
grant all on pinceles.gallery_items to service_role;

-- Lectura pública: solo los visibles.
drop policy if exists p_public_read on pinceles.gallery_items;
create policy p_public_read on pinceles.gallery_items
  for select to anon, authenticated using (is_visible);

-- Escritura: solo admins.
drop policy if exists p_admin_all on pinceles.gallery_items;
create policy p_admin_all on pinceles.gallery_items
  for all to authenticated using (pinceles.is_admin()) with check (pinceles.is_admin());
