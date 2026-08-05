<?php
// Menú del panel: [etiqueta, archivo, ícono lucide, super_only]
function admin_nav(): array
{
    return [
        ['Resumen', 'index.php', 'layout-dashboard', false],
        ['Proyectos', 'proyectos.php', 'image', false],
        ['Servicios', 'coleccion.php?c=services', 'briefcase', false],
        ['Hero', 'singleton.php?c=hero', 'panels-top-left', false],
        ['Nosotros', 'singleton.php?c=about', 'users', false],
        ['Valores', 'coleccion.php?c=company_values', 'heart', false],
        ['Estadísticas', 'coleccion.php?c=statistics', 'bar-chart-3', false],
        ['Confianza', 'coleccion.php?c=trust_items', 'badge-check', false],
        ['Proceso', 'coleccion.php?c=process_steps', 'list-checks', false],
        ['Industrias', 'coleccion.php?c=industries', 'factory', false],
        ['Diferenciales', 'coleccion.php?c=differentiators', 'award', false],
        ['Testimonios', 'coleccion.php?c=testimonials', 'message-square', false],
        ['Secciones', 'coleccion.php?c=sections', 'layers', false],
        ['Navegación', 'coleccion.php?c=navigation_items', 'menu', false],
        ['CTA', 'singleton.php?c=cta', 'megaphone', false],
        ['Contacto y config.', 'singleton.php?c=site_settings', 'settings', false],
        ['Solicitudes', 'solicitudes.php', 'inbox', false],
        ['Usuarios', 'usuarios.php', 'user-cog', true],
    ];
}

function admin_header(string $title, array $user): void
{
    $cur = basename($_SERVER['PHP_SELF']) . (isset($_GET['c']) ? '?c=' . $_GET['c'] : '');
    $flash = get_flash();
    ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> · Panel Pinceles</title>
<link rel="icon" href="../images/favicon-pinceles.png">
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<input type="checkbox" id="adm-toggle">
<aside class="adm-sidebar">
  <div class="adm-brand"><img src="../images/favicon-pinceles.png" alt="Pinceles" width="34" height="34"><span>Pinceles</span></div>
  <nav>
    <?php foreach (admin_nav() as [$label, $href, $ic, $super]): ?>
      <?php if ($super && ($user['role'] ?? '') !== 'super_admin') continue; ?>
      <a href="<?= e($href) ?>" class="<?= $cur === $href ? 'active' : '' ?>"><i data-lucide="<?= e($ic) ?>"></i><?= e($label) ?></a>
    <?php endforeach; ?>
  </nav>
  <div class="adm-user">
    <div><strong><?= e($user['full_name']) ?></strong><small><?= $user['role'] === 'super_admin' ? 'Super administrador' : 'Editor' ?></small></div>
    <a href="logout.php" class="adm-logout"><i data-lucide="log-out"></i> Salir</a>
  </div>
</aside>
<div class="adm-main">
  <header class="adm-topbar">
    <label for="adm-toggle" class="adm-burger"><i data-lucide="menu"></i></label>
    <span class="adm-title">Panel · Pinceles</span>
    <a href="../index.php" target="_blank" class="adm-viewsite">Ver sitio ↗</a>
  </header>
  <main class="adm-content">
    <?php if ($flash): ?><div class="adm-flash adm-flash-<?= e($flash['type']) ?>"><?= e($flash['msg']) ?></div><?php endif; ?>
    <?php
}

function admin_footer(): void
{
    ?>
  </main>
</div>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>if (window.lucide) lucide.createIcons();</script>
<script src="assets/admin.js"></script>
</body>
</html>
    <?php
}
