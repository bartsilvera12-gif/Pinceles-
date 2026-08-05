<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/collections.php';
require_once __DIR__ . '/includes/fields.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$key = $_GET['c'] ?? '';
$cfg = SINGLETONS()[$key] ?? null;
if (!$cfg) { flash('Módulo inválido.', 'error'); header('Location: index.php'); exit; }
$table = $cfg['table'];
$row = q1("SELECT * FROM `$table` LIMIT 1");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $data = coerce_fields($cfg['fields'], $_POST);
    $cols = array_keys($data);
    try {
        if ($row) {
            $set = implode(', ', array_map(fn($c) => "`$c` = ?", $cols));
            db()->prepare("UPDATE `$table` SET $set WHERE id = ?")->execute([...array_values($data), $row['id']]);
        } else {
            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $colSql = implode(', ', array_map(fn($c) => "`$c`", $cols));
            db()->prepare("INSERT INTO `$table` ($colSql) VALUES ($ph)")->execute(array_values($data));
        }
        flash('Guardado.');
    } catch (Throwable $ex) {
        flash('No se pudo guardar.', 'error');
    }
    header('Location: singleton.php?c=' . urlencode($key));
    exit;
}

admin_header($cfg['title'], $user);
?>
<div class="pagehead"><div><h1><?= e($cfg['title']) ?></h1></div></div>
<form method="post" class="card">
  <?= csrf_field() ?>
  <div class="grid2">
    <?php foreach ($cfg['fields'] as $f) render_field($f, $row[$f['name']] ?? null); ?>
  </div>
  <div style="display:flex;justify-content:flex-end;margin-top:16px;"><button class="btn" type="submit">Guardar cambios</button></div>
</form>
<?php admin_footer(); ?>
