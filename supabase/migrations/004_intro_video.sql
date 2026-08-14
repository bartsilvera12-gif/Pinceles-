-- 004_intro_video.sql
-- Video destacado a ancho completo, arriba de la sección Proyectos.
alter table pinceles.site_settings
  add column if not exists intro_video_url text,
  add column if not exists intro_video_is_embed boolean not null default false;
