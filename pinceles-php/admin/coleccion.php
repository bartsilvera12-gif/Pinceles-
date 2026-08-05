<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/collections.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$key = $_GET['c'] ?? '';
$cfg = COLLECTIONS()[$key] ?? null;
if (!$cfg) { flash('Módulo inválido.', 'error'); header('Location: index.php'); exit; }
$table = $cfg['table'];

// Acciones POST (borrar, visibilidad, reordenar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $id = (int) ($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    if ($action === 'delete' && empty($cfg['no_delete'])) {
        db()->prepare("DELETE FROM `$table` WHERE id = ?")->execute([$id]);
        flash('Eliminado.');
    } elseif ($action === 'toggle' && !empty($cfg['has_visible'])) {
        db()->prepare("UPDATE `$table` SET is_visible = 1 - is_visible WHERE id = ?")->execute([$id]);
    } elseif (($action === 'up' || $action === 'down') && !empty($cfg['orderable'])) {
        $cur = q1("SELECT id, sort_order FROM `$table` WHERE id = ?", [$id]);
        if ($cur) {
            $op = $action === 'up' ? '<' : '>';
            $ord = $action === 'up' ? 'DESC' : 'ASC';
            $nb = q1("SELECT id, sort_order FROM `$table` WHERE sort_order $op ? ORDER BY sort_order $ord LIMIT 1", [$cur['sort_order']]);
            if ($nb) {
                db()->prepare("UPDATE `$table` SET sort_order = ? WHERE id = ?")->execute([$nb['sort_order'], $cur['id']]);
                db()->prepare("UPDATE `$table` SET sort_order = ? WHERE id = ?")->execute([$cur['sort_order'], $nb['id']]);
            }
        }
    }
    header('Location: coleccion.php?c=' . urlencode($key));
    exit;
}

$order = !empty($cfg['orderable']) ? 'sort_order' : 'id';
$rows = q("SELECT * FROM `$table` ORDER BY $order");

admin_header($cfg['title'], $user);
?>
<div class="pagehead">
  <div><h1><?= e($cfg['title']) ?></h1><p>Gestioná los ítems de esta sección.</p></div>
  <?php if (empty($cfg['no_create'])): ?>
  <a class="btn btn-dark" href="coleccion-editar.php?c=<?= e($key) ?>"><i data-lucide="plus"></i> Agregar <?= e($cfg['singular']) ?></a>
  <?php endif; ?>
</div>

<?php if (!$rows): ?><p style="color:#8a8a8a;">Sin registros.</p><?php endif; ?>

<?php foreach ($rows as $i => $r): $vis = $r['is_visible'] ?? 1; ?>
<div class="row">
  <div class="grow">
    <b><?= e((string) ($r[$cfg['list_title']] ?? '—')) ?></b>
    <?php if (!empty($cfg['list_sub']) && !empty($r[$cfg['list_sub']])): ?><small><?= e(mb_substr((string) $r[$cfg['list_sub']], 0, 90)) ?></small><?php endif; ?>
  </div>
  <?php if (!empty($cfg['orderable'])): ?>
    <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="up"><button class="iconbtn" title="Subir"><i data-lucide="arrow-up"></i></button></form>
    <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="down"><button class="iconbtn" title="Bajar"><i data-lucide="arrow-down"></i></button></form>
  <?php endif; ?>
  <?php if (!empty($cfg['has_visible'])): ?>
    <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="toggle"><button class="iconbtn" title="<?= $vis ? 'Ocultar' : 'Mostrar' ?>" style="color:<?= $vis ? '#1f8a4c' : '#8a8a8a' ?>;"><i data-lucide="<?= $vis ? 'eye' : 'eye-off' ?>"></i></button></form>
  <?php endif; ?>
  <a class="iconbtn" href="coleccion-editar.php?c=<?= e($key) ?>&id=<?= $r['id'] ?>" title="Editar"><i data-lucide="pencil"></i></a>
  <?php if (empty($cfg['no_delete'])): ?>
    <form method="post" data-confirm="¿Eliminar este registro?"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="delete"><button class="iconbtn" title="Eliminar" style="color:#b23b2f;"><i data-lucide="trash-2"></i></button></form>
  <?php endif; ?>
</div>
<?php endforeach; ?>
<?php admin_footer(); ?>
