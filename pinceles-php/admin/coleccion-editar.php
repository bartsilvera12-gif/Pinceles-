<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/collections.php';
require_once __DIR__ . '/includes/fields.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$key = $_GET['c'] ?? '';
$cfg = COLLECTIONS()[$key] ?? null;
if (!$cfg) { flash('Módulo inválido.', 'error'); header('Location: index.php'); exit; }
$table = $cfg['table'];
$id = (int) ($_GET['id'] ?? 0);
$row = $id ? q1("SELECT * FROM `$table` WHERE id = ?", [$id]) : null;
if ($id && !$row) { flash('No encontrado.', 'error'); header('Location: coleccion.php?c=' . urlencode($key)); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $data = coerce_fields($cfg['fields'], $_POST);
    if (!empty($cfg['has_visible'])) $data['is_visible'] = !empty($_POST['is_visible']) ? 1 : 0;

    // Validación de requeridos
    foreach ($cfg['fields'] as $f) {
        if (!empty($f['required']) && ($data[$f['name']] ?? null) === null) {
            flash('El campo "' . $f['label'] . '" es obligatorio.', 'error');
            header('Location: ' . $_SERVER['REQUEST_URI']);
            exit;
        }
    }

    $cols = array_keys($data);
    try {
        if ($id) {
            $set = implode(', ', array_map(fn($c) => "`$c` = ?", $cols));
            $st = db()->prepare("UPDATE `$table` SET $set WHERE id = ?");
            $st->execute([...array_values($data), $id]);
        } else {
            if (!empty($cfg['orderable'])) {
                $max = (int) (q1("SELECT COALESCE(MAX(sort_order),0) m FROM `$table`")['m'] ?? 0);
                $data['sort_order'] = $max + 1;
                $cols[] = 'sort_order';
            }
            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $colSql = implode(', ', array_map(fn($c) => "`$c`", $cols));
            $st = db()->prepare("INSERT INTO `$table` ($colSql) VALUES ($ph)");
            $st->execute(array_values($data));
        }
        flash('Guardado.');
        header('Location: coleccion.php?c=' . urlencode($key));
        exit;
    } catch (Throwable $ex) {
        flash('No se pudo guardar (¿slug repetido?).', 'error');
        header('Location: ' . $_SERVER['REQUEST_URI']);
        exit;
    }
}

admin_header(($id ? 'Editar ' : 'Nuevo ') . $cfg['singular'], $user);
?>
<div class="pagehead"><div><h1><?= $id ? 'Editar' : 'Nuevo' ?> <?= e($cfg['singular']) ?></h1></div></div>
<form method="post" class="card">
  <?= csrf_field() ?>
  <div class="grid2">
    <?php foreach ($cfg['fields'] as $f) render_field($f, $row[$f['name']] ?? null); ?>
    <?php if (!empty($cfg['has_visible'])): ?>
      <div class="field" style="grid-column:1 / -1;"><label style="display:flex;align-items:center;gap:10px;cursor:pointer;"><input type="checkbox" name="is_visible" value="1" style="width:auto;min-height:auto;" <?= (!$id || !empty($row['is_visible'])) ? 'checked' : '' ?>> Visible</label></div>
    <?php endif; ?>
  </div>
  <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;">
    <a class="btn btn-ghost" href="coleccion.php?c=<?= e($key) ?>">Cancelar</a>
    <button class="btn" type="submit">Guardar</button>
  </div>
</form>
<?php admin_footer(); ?>
