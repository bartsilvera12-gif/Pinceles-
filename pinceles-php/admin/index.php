<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$pub   = (int) (q1("SELECT COUNT(*) n FROM projects WHERE status='published'")['n'] ?? 0);
$draft = (int) (q1("SELECT COUNT(*) n FROM projects WHERE status='draft'")['n'] ?? 0);
$svc   = (int) (q1("SELECT COUNT(*) n FROM services")['n'] ?? 0);
$nuevas = (int) (q1("SELECT COUNT(*) n FROM contact_submissions WHERE status='nuevo'")['n'] ?? 0);
$mes   = (int) (q1("SELECT COUNT(*) n FROM contact_submissions WHERE created_at >= DATE_FORMAT(NOW(),'%Y-%m-01')")['n'] ?? 0);
$lastProjects = q("SELECT id, title, status FROM projects ORDER BY id DESC LIMIT 5");
$lastReq = q("SELECT id, name, status, created_at FROM contact_submissions ORDER BY id DESC LIMIT 5");

admin_header('Resumen', $user);
?>
<div class="pagehead"><div><h1>Resumen</h1><p>Estado general del sitio.</p></div></div>

<div class="tiles">
  <a class="tile" href="proyectos.php"><b><?= $pub ?></b><span>Proyectos publicados</span></a>
  <a class="tile" href="proyectos.php"><b><?= $draft ?></b><span>Proyectos en borrador</span></a>
  <a class="tile" href="coleccion.php?c=services"><b><?= $svc ?></b><span>Servicios</span></a>
  <a class="tile" href="solicitudes.php"><b><?= $nuevas ?></b><span>Solicitudes nuevas</span></a>
  <a class="tile" href="solicitudes.php"><b><?= $mes ?></b><span>Solicitudes del mes</span></a>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:20px;">
  <div class="card">
    <h2 style="margin:0 0 12px;font-size:16px;">Últimos proyectos</h2>
    <?php foreach ($lastProjects as $p): ?>
      <a href="proyecto-editar.php?id=<?= $p['id'] ?>" style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid rgba(5,5,5,.06);color:#050505;">
        <span style="font-weight:600;font-size:14px;"><?= e($p['title']) ?></span><span style="font-size:12px;color:#4d4d4e;"><?= e($p['status']) ?></span>
      </a>
    <?php endforeach; ?>
    <?php if (!$lastProjects): ?><p style="color:#8a8a8a;">Sin proyectos.</p><?php endif; ?>
  </div>
  <div class="card">
    <h2 style="margin:0 0 12px;font-size:16px;">Últimas solicitudes</h2>
    <?php foreach ($lastReq as $r): ?>
      <a href="solicitudes.php" style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid rgba(5,5,5,.06);color:#050505;">
        <span style="font-weight:600;font-size:14px;"><?= e($r['name']) ?></span><span style="font-size:12px;color:#4d4d4e;"><?= e($r['status']) ?></span>
      </a>
    <?php endforeach; ?>
    <?php if (!$lastReq): ?><p style="color:#8a8a8a;">Sin solicitudes.</p><?php endif; ?>
  </div>
</div>
<?php admin_footer(); ?>
