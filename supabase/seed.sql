-- ============================================================================
-- Pinceles — Seed inicial (idempotente)
-- Carga el contenido actual del index.html estático en el schema `pinceles`.
-- Re-ejecutable: usa ON CONFLICT / WHERE NOT EXISTS para no pisar ediciones.
-- Las imágenes apuntan a /images/*; luego se reemplazan desde Multimedia.
-- ============================================================================

-- ---- site_settings (singleton) --------------------------------------------
insert into pinceles.site_settings (
  company_name, slogan, short_description, logo_url, logo_alt,
  phone_display, whatsapp_number, whatsapp_default_message, email,
  country, coverage, business_hours, copyright_text
)
select
  'Pinceles',
  'Coloreando el futuro, un trazo a la vez.',
  'Servicios profesionales de pintura residencial, comercial e industrial. Calidad, cumplimiento y soluciones adaptadas a cada proyecto.',
  '/images/logo-pinceles.jpg',
  'Logo de Pinceles',
  '0982-897118',
  '595982897118',
  'Hola, quisiera solicitar un presupuesto para un trabajo de pintura.',
  'pingceles@gmail.com',
  'Paraguay',
  'Todo el país',
  'Lunes a viernes, 07:00 a 17:00',
  'Todos los derechos reservados.'
where not exists (select 1 from pinceles.site_settings);

-- ---- navigation_items ------------------------------------------------------
insert into pinceles.navigation_items (label, href, sort_order)
select v.label, v.href, v.ord from (values
  ('Inicio','#inicio',1),
  ('Nosotros','#nosotros',2),
  ('Servicios','#servicios',3),
  ('Proyectos','#proyectos',4),
  ('Industrias','#industrias',5),
  ('Contacto','#contacto',6)
) as v(label,href,ord)
where not exists (select 1 from pinceles.navigation_items n where n.href = v.href);

-- ---- site_sections ---------------------------------------------------------
insert into pinceles.site_sections (section_key, internal_name, eyebrow, title, description, sort_order)
select v.k, v.nm, v.eb, v.ti, v.de, v.ord from (values
  ('hero','Hero', 'Pinturas, obras e industria', 'Soluciones que transforman cada espacio.', null, 1),
  ('trust','Barra de confianza', null, null, null, 2),
  ('services','Servicios', 'Servicios', 'Soluciones para cada proyecto', 'Trabajamos con procesos definidos, materiales de primera línea y personal capacitado, en obras residenciales, comerciales e industriales.', 3),
  ('about','Nosotros', 'Sobre nosotros', 'Compromiso con grandes resultados', null, 4),
  ('process','Proceso', 'Proceso', 'Así trabajamos', null, 5),
  ('projects','Proyectos', 'Proyectos', 'Trabajos realizados', 'Experiencia comprobada en obras industriales, terminales de combustible y proyectos de gran escala.', 6),
  ('industries','Industrias', 'Industrias y clientes', 'A quiénes acompañamos', 'Adaptamos el alcance, los materiales y los protocolos de seguridad al tipo de espacio y a la operación de cada cliente.', 7),
  ('differentiators','Diferenciales', 'Diferenciales', '¿Por qué elegir Pinceles?', null, 8),
  ('testimonials','Testimonios', 'Testimonios', 'Lo que dicen nuestros clientes', null, 9),
  ('cta','CTA', null, 'Tu proyecto merece un acabado profesional', null, 10),
  ('contact','Contacto', 'Contacto', 'Pedí tu presupuesto', 'Completá el formulario y lo recibimos directamente por WhatsApp. También podés escribirnos por los canales de siempre.', 11)
) as v(k,nm,eb,ti,de,ord)
where not exists (select 1 from pinceles.site_sections s where s.section_key = v.k);

-- testimonios oculta hasta tener testimonios publicados
update pinceles.site_sections set is_visible = false where section_key = 'testimonials';

-- ---- hero_content (singleton) ---------------------------------------------
insert into pinceles.hero_content (
  eyebrow, title_before_highlight, highlighted_text, title_after_highlight, description,
  image_url, image_alt, image_badge,
  primary_button_text, primary_button_url, secondary_button_text, secondary_button_url
)
select
  'Pinturas, obras e industria',
  'Soluciones que ', 'transforman', ' cada espacio.',
  'Ofrecemos servicios profesionales de pintura, mantenimiento y obras, combinando calidad, experiencia y compromiso para transformar hogares, comercios e industrias.',
  '/images/hero-tanque.jpeg',
  'Equipo de Pinceles pintando un tanque industrial con trabajo vertical',
  'Trabajos en altura certificados',
  'Solicitar presupuesto', '#contacto',
  'Contactar por WhatsApp', '#contacto'
where not exists (select 1 from pinceles.hero_content);

-- ---- trust_items -----------------------------------------------------------
insert into pinceles.trust_items (icon, title, subtitle, sort_order)
select v.ic, v.ti, v.su, v.ord from (values
  ('badge-check','Calidad garantizada','Materiales premium',1),
  ('clock','Cumplimos los tiempos','Compromiso real',2),
  ('users','Atención personalizada','Asesoría en cada etapa',3),
  ('shield-check','Seguridad en cada trabajo','Protocolos y equipos',4)
) as v(ic,ti,su,ord)
where not exists (select 1 from pinceles.trust_items t where t.title = v.ti);

-- ---- services --------------------------------------------------------------
insert into pinceles.services (slug, icon, title, short_description, sort_order)
select v.sl, v.ic, v.ti, v.de, v.ord from (values
  ('pintura-residencial','paint-roller','Pintura residencial','Renovamos interiores y fachadas de viviendas con acabados prolijos y colores a medida.',1),
  ('pintura-comercial','store','Pintura comercial','Locales, oficinas y espacios de atención, con trabajos planificados para no interrumpir la operación.',2),
  ('pintura-de-obras','hard-hat','Pintura de obras','Aplicación profesional en obras nuevas y remodelaciones, interior y exterior.',3),
  ('pintura-industrial','factory','Pintura industrial','Tanques, naves, estructuras metálicas y maquinaria, con esquemas de protección adecuados.',4),
  ('revestimientos','layers','Revestimientos','Texturas, impermeabilizantes y revestimientos decorativos de larga duración.',5),
  ('mantenimiento-preventivo','wrench','Mantenimiento preventivo','Planes periódicos para conservar superficies y anticipar deterioros.',6),
  ('senalizacion-corporativa','signpost','Señalización y pintura corporativa','Demarcación, señalética y aplicación de identidad de marca en superficies de gran escala.',7),
  ('trabajos-generales','ruler','Trabajos generales','Reparación de paredes, pequeñas obras y servicios complementarios de terminación.',8)
) as v(sl,ic,ti,de,ord)
on conflict (slug) do nothing;

-- ---- about_content (singleton) --------------------------------------------
insert into pinceles.about_content (
  eyebrow, title, description, primary_image_url, primary_image_alt, secondary_image_url, secondary_image_alt
)
select
  'Sobre nosotros', 'Compromiso con grandes resultados',
  'En Pinceles combinamos experiencia, materiales de calidad y procesos profesionales para brindar soluciones duraderas, seguras y adaptadas a las necesidades de cada cliente.',
  '/images/equipo.jpeg', 'Pintor de Pinceles trabajando en altura sobre un tanque',
  '/images/proj-edificio.jpeg', 'Obra en construcción intervenida por Pinceles'
where not exists (select 1 from pinceles.about_content);

-- ---- company_values --------------------------------------------------------
insert into pinceles.company_values (name, icon, sort_order)
select v.nm, 'check', v.ord from (values
  ('Responsabilidad',1),('Calidad',2),('Seguridad',3),
  ('Transparencia',4),('Cumplimiento',5),('Atención personalizada',6)
) as v(nm,ord)
where not exists (select 1 from pinceles.company_values c where c.name = v.nm);

-- ---- statistics (ocultas: valores de ejemplo, editables) -------------------
insert into pinceles.statistics (value, label, is_visible, sort_order)
select v.va, v.la, false, v.ord from (values
  ('+120','Proyectos realizados',1),
  ('+8','Años de experiencia',2),
  ('+80','Clientes satisfechos',3),
  ('17','Zonas atendidas',4)
) as v(va,la,ord)
where not exists (select 1 from pinceles.statistics s where s.label = v.la);

-- ---- process_steps ---------------------------------------------------------
insert into pinceles.process_steps (step_number, title, description, sort_order)
select v.n, v.ti, v.de, v.ord from (values
  ('01','Evaluación del proyecto','Visitamos el espacio, medimos y relevamos el estado de las superficies.',1),
  ('02','Preparación del presupuesto','Alcance, materiales y plazos detallados, sin costos ocultos.',2),
  ('03','Planificación y materiales','Definimos cronograma, esquema de pintura y logística del equipo.',3),
  ('04','Ejecución profesional','Trabajo con protocolos de seguridad y supervisión permanente.',4),
  ('05','Revisión y entrega final','Control de terminaciones, limpieza del área y entrega conforme.',5)
) as v(n,ti,de,ord)
where not exists (select 1 from pinceles.process_steps p where p.title = v.ti);

-- ---- project_categories ----------------------------------------------------
insert into pinceles.project_categories (name, slug, sort_order)
select v.nm, v.sl, v.ord from (values
  ('Industriales','industriales',1),
  ('Obras','obras',2),
  ('Mantenimiento','mantenimiento',3),
  ('Comerciales','comerciales',4),
  ('Residenciales','residenciales',5)
) as v(nm,sl,ord)
on conflict (slug) do nothing;

-- ---- projects --------------------------------------------------------------
insert into pinceles.projects (slug, title, location, category_id, cover_image_url, cover_image_alt, sort_order)
select v.sl, v.ti, v.lo,
  (select id from pinceles.project_categories c where c.slug = v.cat),
  v.img, v.alt, v.ord
from (values
  ('pintura-tanques-trabajo-vertical','Pintura de tanques con trabajo vertical certificado','Terminal de combustibles','industriales','/images/proj-tanque-vertical.jpeg','Operario suspendido con arnés pintando la pared de un tanque de almacenamiento',1),
  ('senalizacion-corporativa-techos-tanques','Señalización corporativa en techos de tanques','Planta PetroSan','industriales','/images/proj-petrosan-navios.jpeg','Vista aérea de dos techos de tanques con los logotipos de Navios y PetroSan pintados',2),
  ('pintura-identificacion-tanque-almacenamiento','Pintura e identificación de tanque de almacenamiento','Terminal de combustibles','industriales','/images/proj-tanque-logo-cima.jpeg','Tanque de almacenamiento con cuadrilla suspendida y logotipo azul pintándose en la cima',3),
  ('pintura-identificacion-barcaza-fluvial','Pintura e identificación de barcaza fluvial','Río Paraguay','obras','/images/proj-navios-barcaza.jpeg','Vista aérea de una barcaza con el logotipo de Navios pintado sobre la cubierta',4),
  ('esquema-pintura-naval-cubierta','Esquema de pintura naval y demarcación de cubierta','Astillero','mantenimiento','/images/proj-barcaza-cubierta.jpeg','Vista aérea de la cubierta de una barcaza pintada en azul con bordes amarillos',5),
  ('pintura-fachada-torre-residencial','Pintura de fachada en torre residencial','Asunción','obras','/images/proj-torre.jpeg','Vista aérea de una torre residencial en construcción rodeada de la ciudad',6),
  ('mantenimiento-pintura-parque-tanques','Mantenimiento y pintura de parque de tanques','Terminal de combustibles','industriales','/images/proj-tanque-flota.jpeg','Vista de un parque de tanques de almacenamiento pintados de blanco',7),
  ('preparacion-pintura-techos-tanques','Preparación y pintura de techos de tanques','Planta PetroSan','industriales','/images/proj-petrosan-detalle.jpeg','Vista aérea de dos tanques, uno recién preparado y otro con el logotipo de PetroSan pintado',8),
  ('preparacion-pintura-tanque-andamios','Preparación y pintura de tanque con andamios colgantes','Terminal de combustibles','industriales','/images/proj-tanque-contraluz.jpeg','Cuadrilla en trabajo vertical preparando la pared de un tanque de almacenamiento',9),
  ('pintura-senalizacion-conjunto-tanques','Pintura y señalización de conjunto de tanques','Planta PetroSan','industriales','/images/proj-petrosan-conjunto.jpeg','Vista aérea de un conjunto de tanques con los logotipos de Navios y PetroSan',10),
  ('pintura-identificacion-casco-barcaza','Pintura e identificación de casco de barcaza','Río Paraguay','obras','/images/proj-navios-lateral.jpeg','Barcaza con el nombre Navios South American Logistics pintado en el casco',11),
  ('pintura-fachada-torre-departamentos','Pintura de fachada en torre de departamentos','Asunción','obras','/images/proj-torre-calle.jpeg','Torre de departamentos en construcción vista desde la calle',12),
  ('pintura-tanque-cuadrilla-vertical','Pintura de tanque con cuadrilla en trabajo vertical','Terminal de combustibles','industriales','/images/proj-tanque-cuadrilla.jpeg','Cuadrilla de pintores suspendidos con arnés trabajando sobre un tanque',13),
  ('preparacion-pintura-techo-industrial','Preparación y pintura de techo industrial en altura','Planta industrial','mantenimiento','/images/proj-techo-cuadrilla.jpeg','Operarios trabajando sobre el techo curvo de una nave industrial',14),
  ('aplicacion-pintura-cubierta-barcaza','Aplicación de pintura en cubierta de barcaza','Astillero','mantenimiento','/images/proj-barcaza-cubierta2.jpeg','Vista aérea de la cubierta de una barcaza pintada en azul con bordes amarillos',15),
  ('terminacion-mantenimiento-base-tanque','Terminación y mantenimiento de base de tanque','Terminal de combustibles','industriales','/images/proj-tanque-base.jpeg','Base de un tanque de almacenamiento con cañerías y área perimetral',16),
  ('pintura-fachada-torre-casco-urbano','Pintura de fachada en torre sobre el casco urbano','Asunción','obras','/images/proj-torre-tejas.jpeg','Torre residencial en construcción vista sobre techos de teja',17),
  ('muelle-carga-barcaza-rio','Muelle de carga y barcaza sobre el río','Río Paraguay','obras','/images/proj-puerto-aereo.jpeg','Vista aérea de un muelle de carga con una barcaza sobre el río',18)
) as v(sl,ti,lo,cat,img,alt,ord)
on conflict (slug) do nothing;

-- ---- project_images (portada de cada proyecto) -----------------------------
insert into pinceles.project_images (project_id, image_url, alt_text, is_cover, sort_order)
select p.id, p.cover_image_url, p.cover_image_alt, true, 0
from pinceles.projects p
where p.cover_image_url is not null
  and not exists (select 1 from pinceles.project_images i where i.project_id = p.id);

-- ---- industries ------------------------------------------------------------
insert into pinceles.industries (slug, icon, name, sort_order)
select v.sl, v.ic, v.nm, v.ord from (values
  ('viviendas','house','Viviendas',1),
  ('comercios','store','Comercios',2),
  ('oficinas','building-2','Oficinas',3),
  ('depositos','warehouse','Depósitos',4),
  ('industrias','factory','Industrias',5),
  ('estaciones-de-servicio','fuel','Estaciones de servicio',6),
  ('plantas-y-terminales','container','Plantas y terminales',7),
  ('constructoras','hard-hat','Constructoras',8),
  ('instituciones','landmark','Instituciones',9)
) as v(sl,ic,nm,ord)
on conflict (slug) do nothing;

-- ---- differentiators -------------------------------------------------------
insert into pinceles.differentiators (number_label, title, description, sort_order)
select v.n, v.ti, v.de, v.ord from (values
  ('01','Presupuestos claros','Detalle de alcance, materiales y plazos antes de empezar.',1),
  ('02','Materiales de calidad','Productos de marcas reconocidas según cada superficie.',2),
  ('03','Personal capacitado','Equipo formado en pintura industrial y trabajos en altura.',3),
  ('04','Cumplimiento de plazos','Cronogramas realistas y seguimiento diario del avance.',4),
  ('05','Protocolos de seguridad','Elementos de protección y procedimientos en cada tarea.',5),
  ('06','Seguimiento personalizado','Un responsable de contacto durante todo el proyecto.',6),
  ('07','Soluciones adaptadas','Esquemas de trabajo pensados para cada espacio y operación.',7),
  ('08','Atención en todo el país','Disponibilidad para obras dentro y fuera del área metropolitana.',8)
) as v(n,ti,de,ord)
where not exists (select 1 from pinceles.differentiators d where d.title = v.ti);

-- ---- cta_content (singleton) ----------------------------------------------
insert into pinceles.cta_content (
  title, highlighted_text, description,
  primary_button_text, primary_button_url, secondary_button_text, secondary_button_url
)
select
  'Tu proyecto merece un acabado profesional', 'acabado profesional',
  'Contanos qué necesitás y prepararemos una solución adaptada a tu espacio, obra o industria.',
  'Solicitar presupuesto', '#contacto', 'Hablar por WhatsApp', '#contacto'
where not exists (select 1 from pinceles.cta_content);

-- ---- footer_links ----------------------------------------------------------
insert into pinceles.footer_links (group_name, label, url, sort_order)
select v.gr, v.la, v.ur, v.ord from (values
  ('Servicios','Pintura residencial','#servicios',1),
  ('Servicios','Pintura comercial','#servicios',2),
  ('Servicios','Pintura industrial','#servicios',3),
  ('Servicios','Revestimientos','#servicios',4),
  ('Servicios','Mantenimiento preventivo','#servicios',5)
) as v(gr,la,ur,ord)
where not exists (select 1 from pinceles.footer_links f where f.group_name = v.gr and f.label = v.la);

-- ---- legal_pages -----------------------------------------------------------
insert into pinceles.legal_pages (slug, title, content, status)
select 'privacidad', 'Política de privacidad',
  'En Pinceles valoramos la confianza de quienes nos contactan. Esta política explica qué datos personales tratamos, con qué finalidad y cuáles son tus derechos cuando nos compartís información a través de este sitio web, del formulario de presupuesto o de nuestros canales de contacto.',
  'published'
where not exists (select 1 from pinceles.legal_pages where slug = 'privacidad');

insert into pinceles.legal_pages (slug, title, content, status)
select 'terminos', 'Términos y condiciones',
  'Contenido pendiente de definir.', 'draft'
where not exists (select 1 from pinceles.legal_pages where slug = 'terminos');

-- Recargar caché de PostgREST
notify pgrst, 'reload schema';

-- FIN seed
