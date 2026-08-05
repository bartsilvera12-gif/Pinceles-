-- ============================================================================
-- Pinceles — Base de datos MySQL (para Hostinger / phpMyAdmin)
-- Importá este archivo en tu base de datos MySQL desde phpMyAdmin.
-- Charset utf8mb4. Motor InnoDB.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---- admin_users -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(160) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- site_settings (fila única) -------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  company_name             VARCHAR(160) DEFAULT 'Pinceles',
  slogan                   VARCHAR(255),
  short_description        TEXT,
  logo_url                 VARCHAR(255),
  logo_alt                 VARCHAR(255),
  favicon_url              VARCHAR(255),
  phone_display            VARCHAR(60),
  whatsapp_number          VARCHAR(40),
  whatsapp_default_message TEXT,
  email                    VARCHAR(190),
  address                  VARCHAR(255),
  city                     VARCHAR(120),
  country                  VARCHAR(120),
  coverage                 VARCHAR(160),
  business_hours           VARCHAR(160),
  map_url                  VARCHAR(255),
  copyright_text           VARCHAR(255),
  primary_color            VARCHAR(20) DEFAULT '#D9912F',
  secondary_color          VARCHAR(20) DEFAULT '#DEB97F',
  background_color         VARCHAR(20) DEFAULT '#F8F6F1',
  dark_color               VARCHAR(20) DEFAULT '#050505',
  updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- navigation_items ------------------------------------------------------
CREATE TABLE IF NOT EXISTS navigation_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label      VARCHAR(120) NOT NULL,
  href       VARCHAR(190) NOT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- sections (control de visibilidad/orden y textos) ----------------------
CREATE TABLE IF NOT EXISTS sections (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  section_key  VARCHAR(60) NOT NULL UNIQUE,
  internal_name VARCHAR(120) NOT NULL,
  eyebrow      VARCHAR(190),
  title        VARCHAR(255),
  description  TEXT,
  is_visible   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- hero (fila única) -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hero (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow                VARCHAR(190),
  title_before_highlight VARCHAR(255),
  highlighted_text       VARCHAR(190),
  title_after_highlight  VARCHAR(255),
  description            TEXT,
  image_url             VARCHAR(255),
  image_alt             VARCHAR(255),
  image_badge           VARCHAR(190),
  primary_button_text   VARCHAR(120),
  primary_button_url    VARCHAR(190),
  secondary_button_text VARCHAR(120),
  secondary_button_url  VARCHAR(190),
  is_visible            TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- trust_items -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS trust_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  icon       VARCHAR(60),
  title      VARCHAR(190) NOT NULL,
  subtitle   VARCHAR(190),
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- services --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  slug              VARCHAR(190) NOT NULL UNIQUE,
  icon              VARCHAR(60),
  title             VARCHAR(190) NOT NULL,
  short_description TEXT,
  full_description  TEXT,
  image_url         VARCHAR(255),
  is_featured       TINYINT(1) NOT NULL DEFAULT 0,
  is_visible        TINYINT(1) NOT NULL DEFAULT 1,
  sort_order        INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- about (fila única) ----------------------------------------------------
CREATE TABLE IF NOT EXISTS about (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow             VARCHAR(190),
  title               VARCHAR(255),
  description         TEXT,
  primary_image_url   VARCHAR(255),
  primary_image_alt   VARCHAR(255),
  secondary_image_url VARCHAR(255),
  secondary_image_alt VARCHAR(255),
  is_visible          TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- company_values --------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_values (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(190) NOT NULL,
  icon       VARCHAR(60),
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- statistics ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS statistics (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  value      VARCHAR(60) NOT NULL,
  label      VARCHAR(190) NOT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- process_steps ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS process_steps (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  step_number VARCHAR(10),
  title       VARCHAR(190) NOT NULL,
  description TEXT,
  is_visible  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- project_categories ----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  slug       VARCHAR(120) NOT NULL UNIQUE,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- projects --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  category_id       INT NULL,
  slug              VARCHAR(190) NOT NULL UNIQUE,
  title             VARCHAR(255) NOT NULL,
  short_description TEXT,
  full_description  TEXT,
  client_name       VARCHAR(190),
  location          VARCHAR(190),
  completion_date   DATE NULL,
  cover_image_url   VARCHAR(255),
  cover_image_alt   VARCHAR(255),
  status            ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  is_featured       TINYINT(1) NOT NULL DEFAULT 0,
  is_visible        TINYINT(1) NOT NULL DEFAULT 1,
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- project_images --------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  image_url  VARCHAR(255) NOT NULL,
  alt_text   VARCHAR(255),
  is_cover   TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- industries ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS industries (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(120) NOT NULL UNIQUE,
  icon       VARCHAR(60),
  name       VARCHAR(190) NOT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- differentiators -------------------------------------------------------
CREATE TABLE IF NOT EXISTS differentiators (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  number_label VARCHAR(10),
  title        VARCHAR(190) NOT NULL,
  description  TEXT,
  is_visible   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- testimonials ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  client_name    VARCHAR(190) NOT NULL,
  client_company VARCHAR(190),
  testimonial    TEXT NOT NULL,
  rating         TINYINT NULL,
  status         ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  is_visible     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order     INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- cta (fila única) ------------------------------------------------------
CREATE TABLE IF NOT EXISTS cta (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  title                 VARCHAR(255),
  highlighted_text      VARCHAR(190),
  description           TEXT,
  primary_button_text   VARCHAR(120),
  primary_button_url    VARCHAR(190),
  secondary_button_text VARCHAR(120),
  secondary_button_url  VARCHAR(190),
  is_visible            TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- footer_links ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS footer_links (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(120) NOT NULL,
  label      VARCHAR(190) NOT NULL,
  url        VARCHAR(190) NOT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- legal_pages -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS legal_pages (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  slug     VARCHAR(120) NOT NULL UNIQUE,
  title    VARCHAR(190) NOT NULL,
  content  MEDIUMTEXT,
  status   ENUM('draft','published','archived') NOT NULL DEFAULT 'published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- contact_submissions ---------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  name                  VARCHAR(190) NOT NULL,
  company               VARCHAR(190),
  phone                 VARCHAR(60) NOT NULL,
  email                 VARCHAR(190),
  service_name_snapshot VARCHAR(190),
  location              VARCHAR(190),
  message               TEXT,
  status                ENUM('nuevo','contactado','cotizado','aprobado','cerrado','descartado') NOT NULL DEFAULT 'nuevo',
  internal_notes        TEXT,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- DATOS INICIALES (contenido actual de Pinceles)
-- ============================================================================

INSERT INTO site_settings
  (company_name, slogan, short_description, logo_url, logo_alt, phone_display, whatsapp_number, whatsapp_default_message, email, country, coverage, business_hours, copyright_text)
VALUES
  ('Pinceles','Coloreando el futuro, un trazo a la vez.',
   'Servicios profesionales de pintura residencial, comercial e industrial. Calidad, cumplimiento y soluciones adaptadas a cada proyecto.',
   'images/logo-pinceles.jpg','Logo de Pinceles','0982-897118','595982897118',
   'Hola, quisiera solicitar un presupuesto para un trabajo de pintura.',
   'pingceles@gmail.com','Paraguay','Todo el país','Lunes a viernes, 07:00 a 17:00','Todos los derechos reservados.');

INSERT INTO navigation_items (label, href, sort_order) VALUES
  ('Inicio','#inicio',1),('Nosotros','#nosotros',2),('Servicios','#servicios',3),
  ('Proyectos','#proyectos',4),('Industrias','#industrias',5),('Contacto','#contacto',6);

INSERT INTO sections (section_key, internal_name, eyebrow, title, description, is_visible, sort_order) VALUES
  ('services','Servicios','Servicios','Soluciones para cada proyecto','Trabajamos con procesos definidos, materiales de primera línea y personal capacitado, en obras residenciales, comerciales e industriales.',1,3),
  ('about','Nosotros','Sobre nosotros','Compromiso con grandes resultados',NULL,1,4),
  ('process','Proceso','Proceso','Así trabajamos',NULL,1,5),
  ('projects','Proyectos','Proyectos','Trabajos realizados','Experiencia comprobada en obras industriales, terminales de combustible y proyectos de gran escala.',1,6),
  ('industries','Industrias','Industrias y clientes','A quiénes acompañamos','Adaptamos el alcance, los materiales y los protocolos de seguridad al tipo de espacio y a la operación de cada cliente.',1,7),
  ('differentiators','Diferenciales','Diferenciales','¿Por qué elegir Pinceles?',NULL,1,8),
  ('testimonials','Testimonios','Testimonios','Lo que dicen nuestros clientes',NULL,0,9),
  ('contact','Contacto','Contacto','Pedí tu presupuesto','Completá el formulario y lo recibimos directamente por WhatsApp. También podés escribirnos por los canales de siempre.',1,11);

INSERT INTO hero
  (eyebrow, title_before_highlight, highlighted_text, title_after_highlight, description, image_url, image_alt, image_badge, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url)
VALUES
  ('Pinturas, obras e industria','Soluciones que ','transforman',' cada espacio.',
   'Ofrecemos servicios profesionales de pintura, mantenimiento y obras, combinando calidad, experiencia y compromiso para transformar hogares, comercios e industrias.',
   'images/hero-tanque.jpeg','Equipo de Pinceles pintando un tanque industrial con trabajo vertical','Trabajos en altura certificados',
   'Solicitar presupuesto','#contacto','Contactar por WhatsApp','#contacto');

INSERT INTO trust_items (icon, title, subtitle, sort_order) VALUES
  ('badge-check','Calidad garantizada','Materiales premium',1),
  ('clock','Cumplimos los tiempos','Compromiso real',2),
  ('users','Atención personalizada','Asesoría en cada etapa',3),
  ('shield-check','Seguridad en cada trabajo','Protocolos y equipos',4);

INSERT INTO services (slug, icon, title, short_description, sort_order) VALUES
  ('pintura-residencial','paint-roller','Pintura residencial','Renovamos interiores y fachadas de viviendas con acabados prolijos y colores a medida.',1),
  ('pintura-comercial','store','Pintura comercial','Locales, oficinas y espacios de atención, con trabajos planificados para no interrumpir la operación.',2),
  ('pintura-de-obras','hard-hat','Pintura de obras','Aplicación profesional en obras nuevas y remodelaciones, interior y exterior.',3),
  ('pintura-industrial','factory','Pintura industrial','Tanques, naves, estructuras metálicas y maquinaria, con esquemas de protección adecuados.',4),
  ('revestimientos','layers','Revestimientos','Texturas, impermeabilizantes y revestimientos decorativos de larga duración.',5),
  ('mantenimiento-preventivo','wrench','Mantenimiento preventivo','Planes periódicos para conservar superficies y anticipar deterioros.',6),
  ('senalizacion-corporativa','signpost','Señalización y pintura corporativa','Demarcación, señalética y aplicación de identidad de marca en superficies de gran escala.',7),
  ('trabajos-generales','ruler','Trabajos generales','Reparación de paredes, pequeñas obras y servicios complementarios de terminación.',8);

INSERT INTO about (eyebrow, title, description, primary_image_url, primary_image_alt, secondary_image_url, secondary_image_alt) VALUES
  ('Sobre nosotros','Compromiso con grandes resultados',
   'En Pinceles combinamos experiencia, materiales de calidad y procesos profesionales para brindar soluciones duraderas, seguras y adaptadas a las necesidades de cada cliente.',
   'images/equipo.jpeg','Pintor de Pinceles trabajando en altura sobre un tanque',
   'images/proj-edificio.jpeg','Obra en construcción intervenida por Pinceles');

INSERT INTO company_values (name, icon, sort_order) VALUES
  ('Responsabilidad','check',1),('Calidad','check',2),('Seguridad','check',3),
  ('Transparencia','check',4),('Cumplimiento','check',5),('Atención personalizada','check',6);

INSERT INTO statistics (value, label, is_visible, sort_order) VALUES
  ('+120','Proyectos realizados',0,1),('+8','Años de experiencia',0,2),
  ('+80','Clientes satisfechos',0,3),('17','Zonas atendidas',0,4);

INSERT INTO process_steps (step_number, title, description, sort_order) VALUES
  ('01','Evaluación del proyecto','Visitamos el espacio, medimos y relevamos el estado de las superficies.',1),
  ('02','Preparación del presupuesto','Alcance, materiales y plazos detallados, sin costos ocultos.',2),
  ('03','Planificación y materiales','Definimos cronograma, esquema de pintura y logística del equipo.',3),
  ('04','Ejecución profesional','Trabajo con protocolos de seguridad y supervisión permanente.',4),
  ('05','Revisión y entrega final','Control de terminaciones, limpieza del área y entrega conforme.',5);

INSERT INTO project_categories (name, slug, sort_order) VALUES
  ('Industriales','industriales',1),('Obras','obras',2),('Mantenimiento','mantenimiento',3),
  ('Comerciales','comerciales',4),('Residenciales','residenciales',5);

INSERT INTO projects (slug, title, location, category_id, cover_image_url, cover_image_alt, sort_order) VALUES
  ('pintura-tanques-trabajo-vertical','Pintura de tanques con trabajo vertical certificado','Terminal de combustibles',1,'images/proj-tanque-vertical.jpeg','Operario suspendido con arnés pintando la pared de un tanque de almacenamiento',1),
  ('senalizacion-corporativa-techos-tanques','Señalización corporativa en techos de tanques','Planta PetroSan',1,'images/proj-petrosan-navios.jpeg','Vista aérea de dos techos de tanques con los logotipos de Navios y PetroSan pintados',2),
  ('pintura-identificacion-tanque-almacenamiento','Pintura e identificación de tanque de almacenamiento','Terminal de combustibles',1,'images/proj-tanque-logo-cima.jpeg','Tanque de almacenamiento con cuadrilla suspendida y logotipo azul pintándose en la cima',3),
  ('pintura-identificacion-barcaza-fluvial','Pintura e identificación de barcaza fluvial','Río Paraguay',2,'images/proj-navios-barcaza.jpeg','Vista aérea de una barcaza con el logotipo de Navios pintado sobre la cubierta',4),
  ('esquema-pintura-naval-cubierta','Esquema de pintura naval y demarcación de cubierta','Astillero',3,'images/proj-barcaza-cubierta.jpeg','Vista aérea de la cubierta de una barcaza pintada en azul con bordes amarillos',5),
  ('pintura-fachada-torre-residencial','Pintura de fachada en torre residencial','Asunción',2,'images/proj-torre.jpeg','Vista aérea de una torre residencial en construcción rodeada de la ciudad',6),
  ('mantenimiento-pintura-parque-tanques','Mantenimiento y pintura de parque de tanques','Terminal de combustibles',1,'images/proj-tanque-flota.jpeg','Vista de un parque de tanques de almacenamiento pintados de blanco',7),
  ('preparacion-pintura-techos-tanques','Preparación y pintura de techos de tanques','Planta PetroSan',1,'images/proj-petrosan-detalle.jpeg','Vista aérea de dos tanques, uno recién preparado y otro con el logotipo de PetroSan pintado',8),
  ('preparacion-pintura-tanque-andamios','Preparación y pintura de tanque con andamios colgantes','Terminal de combustibles',1,'images/proj-tanque-contraluz.jpeg','Cuadrilla en trabajo vertical preparando la pared de un tanque de almacenamiento',9),
  ('pintura-senalizacion-conjunto-tanques','Pintura y señalización de conjunto de tanques','Planta PetroSan',1,'images/proj-petrosan-conjunto.jpeg','Vista aérea de un conjunto de tanques con los logotipos de Navios y PetroSan',10),
  ('pintura-identificacion-casco-barcaza','Pintura e identificación de casco de barcaza','Río Paraguay',2,'images/proj-navios-lateral.jpeg','Barcaza con el nombre Navios South American Logistics pintado en el casco',11),
  ('pintura-fachada-torre-departamentos','Pintura de fachada en torre de departamentos','Asunción',2,'images/proj-torre-calle.jpeg','Torre de departamentos en construcción vista desde la calle',12),
  ('pintura-tanque-cuadrilla-vertical','Pintura de tanque con cuadrilla en trabajo vertical','Terminal de combustibles',1,'images/proj-tanque-cuadrilla.jpeg','Cuadrilla de pintores suspendidos con arnés trabajando sobre un tanque',13),
  ('preparacion-pintura-techo-industrial','Preparación y pintura de techo industrial en altura','Planta industrial',3,'images/proj-techo-cuadrilla.jpeg','Operarios trabajando sobre el techo curvo de una nave industrial',14),
  ('aplicacion-pintura-cubierta-barcaza','Aplicación de pintura en cubierta de barcaza','Astillero',3,'images/proj-barcaza-cubierta2.jpeg','Vista aérea de la cubierta de una barcaza pintada en azul con bordes amarillos',15),
  ('terminacion-mantenimiento-base-tanque','Terminación y mantenimiento de base de tanque','Terminal de combustibles',1,'images/proj-tanque-base.jpeg','Base de un tanque de almacenamiento con cañerías y área perimetral',16),
  ('pintura-fachada-torre-casco-urbano','Pintura de fachada en torre sobre el casco urbano','Asunción',2,'images/proj-torre-tejas.jpeg','Torre residencial en construcción vista sobre techos de teja',17),
  ('muelle-carga-barcaza-rio','Muelle de carga y barcaza sobre el río','Río Paraguay',2,'images/proj-puerto-aereo.jpeg','Vista aérea de un muelle de carga con una barcaza sobre el río',18);

INSERT INTO project_images (project_id, image_url, alt_text, is_cover, sort_order)
  SELECT id, cover_image_url, cover_image_alt, 1, 0 FROM projects;

INSERT INTO industries (slug, icon, name, sort_order) VALUES
  ('viviendas','house','Viviendas',1),('comercios','store','Comercios',2),('oficinas','building-2','Oficinas',3),
  ('depositos','warehouse','Depósitos',4),('industrias','factory','Industrias',5),
  ('estaciones-de-servicio','fuel','Estaciones de servicio',6),('plantas-y-terminales','container','Plantas y terminales',7),
  ('constructoras','hard-hat','Constructoras',8),('instituciones','landmark','Instituciones',9);

INSERT INTO differentiators (number_label, title, description, sort_order) VALUES
  ('01','Presupuestos claros','Detalle de alcance, materiales y plazos antes de empezar.',1),
  ('02','Materiales de calidad','Productos de marcas reconocidas según cada superficie.',2),
  ('03','Personal capacitado','Equipo formado en pintura industrial y trabajos en altura.',3),
  ('04','Cumplimiento de plazos','Cronogramas realistas y seguimiento diario del avance.',4),
  ('05','Protocolos de seguridad','Elementos de protección y procedimientos en cada tarea.',5),
  ('06','Seguimiento personalizado','Un responsable de contacto durante todo el proyecto.',6),
  ('07','Soluciones adaptadas','Esquemas de trabajo pensados para cada espacio y operación.',7),
  ('08','Atención en todo el país','Disponibilidad para obras dentro y fuera del área metropolitana.',8);

INSERT INTO cta (title, highlighted_text, description, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url) VALUES
  ('Tu proyecto merece un acabado profesional','acabado profesional',
   'Contanos qué necesitás y prepararemos una solución adaptada a tu espacio, obra o industria.',
   'Solicitar presupuesto','#contacto','Hablar por WhatsApp','#contacto');

INSERT INTO footer_links (group_name, label, url, sort_order) VALUES
  ('Servicios','Pintura residencial','#servicios',1),
  ('Servicios','Pintura comercial','#servicios',2),
  ('Servicios','Pintura industrial','#servicios',3),
  ('Servicios','Revestimientos','#servicios',4),
  ('Servicios','Mantenimiento preventivo','#servicios',5);

INSERT INTO legal_pages (slug, title, content, status) VALUES
  ('privacidad','Política de privacidad','En Pinceles valoramos la confianza de quienes nos contactan. Esta política explica qué datos personales tratamos, con qué finalidad y cuáles son tus derechos cuando nos compartís información a través de este sitio web, del formulario de presupuesto o de nuestros canales de contacto.','published'),
  ('terminos','Términos y condiciones','Contenido pendiente de definir.','draft');

-- FIN
