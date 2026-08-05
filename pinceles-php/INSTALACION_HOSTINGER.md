# Pinceles — Instalación en Hostinger (PHP + MySQL)

Sitio en **PHP + MySQL** con panel de administración. Se sube a Hostinger como
cualquier sitio PHP.

## Requisitos
- Hosting con **PHP 7.4+** (ideal 8.x) y **MySQL** (Hostinger lo incluye).

## Paso 1 — Crear la base de datos
1. En **hPanel → Bases de datos → MySQL**, creá una base y un usuario.
2. Anotá: **nombre de la base**, **usuario**, **contraseña** y **host** (casi siempre `localhost`).
3. Entrá a **phpMyAdmin**, seleccioná tu base y en la pestaña **Importar** subí el archivo
   [`database/pinceles.sql`](database/pinceles.sql). Eso crea las tablas y carga todo el contenido.

## Paso 2 — Configurar la conexión
Editá [`config.php`](config.php) con tus datos de MySQL:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tu_base');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_contraseña');
```

## Paso 3 — Subir los archivos
Subí **todo el contenido de la carpeta `pinceles-php/`** a tu `public_html`
(por FTP o el Administrador de archivos de Hostinger). Debe quedar así:

```
public_html/
  index.php
  config.php
  contacto.php
  includes/
  admin/
  assets/
  images/
  uploads/        (debe tener permiso de escritura, 755)
  database/
```

> Asegurate de que la carpeta **`uploads/`** tenga permisos de escritura (755)
> para poder subir imágenes desde el panel.

## Paso 4 — Crear el primer administrador
1. Entrá a **`https://tudominio.com/admin/setup.php`**.
2. Cargá nombre, correo y contraseña → crea el super administrador.
3. **Importante:** después **borrá el archivo `admin/setup.php`** (por seguridad).

## Paso 5 — Listo
- Sitio público: `https://tudominio.com/`
- Panel: `https://tudominio.com/admin/login.php`

Desde el panel podés administrar proyectos, servicios, hero, nosotros, industrias,
diferenciales, testimonios, contacto, secciones, solicitudes y usuarios, y **subir imágenes**.

## Notas
- Las imágenes iniciales están en `images/`. Las que subas desde el panel van a `uploads/`.
- El formulario de contacto guarda la solicitud en la base y abre WhatsApp con el mensaje.
- Si cambiás de dominio, no hace falta tocar nada (las rutas son relativas).
