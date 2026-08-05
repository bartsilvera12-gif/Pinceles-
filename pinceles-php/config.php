<?php
/**
 * Configuración de Pinceles.
 * EDITÁ estos valores con los datos de tu base MySQL en Hostinger
 * (los encontrás en hPanel → Bases de datos MySQL).
 */

// ── Base de datos ──────────────────────────────────────────────
define('DB_HOST', 'localhost');          // en Hostinger casi siempre 'localhost'
define('DB_NAME', 'pinceles');           // nombre de tu base
define('DB_USER', 'root');               // usuario de la base
define('DB_PASS', '');                   // contraseña de la base
define('DB_CHARSET', 'utf8mb4');

// ── Sitio ──────────────────────────────────────────────────────
// URL pública (sin barra final). Se usa para links absolutos/SEO. Opcional.
define('SITE_URL', '');

// Zona horaria
date_default_timezone_set('America/Asuncion');
