<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $id = (int) ($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        db()->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
        flash('Proyecto eliminado.');
    } elseif ($action === 'toggle') {
        $cur = q1("SELECT status FROM projects WHERE id = ?", [$id]);
        $next = ($cur['status'] ?? '') === 'published' ? 'draft' : 'published';
        db()->prepare("UPDATE projects SET status = ? WHERE id = ?")->execute([$next, $id]);
    }
    header('Location: proyectos.php');
    exit;
}

$search = trim($_GET['q'] ?? '');
$fstatus = $_GET['status'] ?? '';
$sql = "SELECT p.*, c.name AS category_name FROM projects p LEFT JOIN project_categories c ON c.id = p.category_id WHERE 1=1";
$params = [];
if ($search !== '') { $sql .= " AND p.title LIKE ?"; $params[] = '%' . $search . '%'; }
if ($fstatus !== '') { $sql .= " AND p.status = ?"; $params[] = $fstatus; }
$sql .= " ORDER BY p.sort_order";
$rows = q($sql, $params);

admin_header('Proyectos', $user);
?>
<div class="pagehead">
  <div><h1>Proyectos</h1><p>Gestioná la galería de trabajos.</p></div>
  <a class="btn btn-dark" href="proyecto-editar.php"><i data-lucide="plus"></i> Nuevo proyecto</a>
</div>

<form class="toolbar" method="get">
  <input type="text" name="q" value="<?= e($search) ?>" placeholder="Buscar por título…" style="flex:1 1 220px;">
  <select name="status">
    <option value="">Todos los estados</option>
    <option value="published" <?= $fstatus === 'published' ? 'selected' : '' ?>>Publicado</option>
    <option value="draft" <?= $fstatus === 'draft' ? 'selected' : '' ?>>Borrador</option>
    <option value="archived" <?= $fstatus === 'archived' ? 'selected' : '' ?>>Archivado</option>
  </select>
  <button class="btn btn-ghost" type="submit">Filtrar</button>
</form>

<?php if (!$rows): ?><p style="color:#8a8a8a;">No hay proyectos.</p><?php endif; ?>
<?php foreach ($rows as $p): $c = $p['status']; $color = $c === 'published' ? '#1f8a4c' : ($c === 'draft' ? '#b8761f' : '#8a8a8a'); ?>
<div class="row">
  <img class="thumb" src="<?= e(amedia((string) $p['cover_image_url'])) ?>" alt="">
  <div class="grow">
    <b><?= e($p['title']) ?></b>
    <small><?= e($p['category_name'] ?? 'Sin categoría') ?><?= $p['location'] ? ' · ' . e($p['location']) : '' ?></small>
  </div>
  <span class="badge" style="color:<?= $color ?>;background:<?= $color ?>1a;"><?= e($c) ?></span>
  <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $p['id'] ?>"><input type="hidden" name="action" value="toggle"><button class="btn btn-ghost" style="padding:8px 12px;"><?= $c === 'published' ? 'Despublicar' : 'Publicar' ?></button></form>
  <a class="btn btn-ghost" style="padding:8px 12px;" href="proyecto-editar.php?id=<?= $p['id'] ?>">Editar</a>
  <form method="post" data-confirm="¿Eliminar “<?= e($p['title']) ?>”?"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $p['id'] ?>"><input type="hidden" name="action" value="delete"><button class="btn btn-danger" style="padding:8px 12px;">Eliminar</button></form>
</div>
<?php endforeach; ?>
<?php admin_footer(); ?>
