<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$id = (int) ($_GET['id'] ?? 0);
$p = $id ? q1("SELECT * FROM projects WHERE id = ?", [$id]) : null;
if ($id && !$p) { flash('Proyecto no encontrado.', 'error'); header('Location: proyectos.php'); exit; }
$cats = q("SELECT * FROM project_categories ORDER BY sort_order");
$images = $id ? q("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order", [$id]) : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    if ($slug === '' && $title !== '') $slug = slugify($title);
    if ($title === '' || $slug === '') {
        flash('El título y el slug son obligatorios.', 'error');
        header('Location: ' . $_SERVER['REQUEST_URI']);
        exit;
    }
    $fields = [
        'category_id'       => ($_POST['category_id'] ?? '') !== '' ? (int) $_POST['category_id'] : null,
        'slug'              => $slug,
        'title'             => $title,
        'short_description' => trim($_POST['short_description'] ?? '') ?: null,
        'full_description'  => trim($_POST['full_description'] ?? '') ?: null,
        'client_name'       => trim($_POST['client_name'] ?? '') ?: null,
        'location'          => trim($_POST['location'] ?? '') ?: null,
        'completion_date'   => trim($_POST['completion_date'] ?? '') ?: null,
        'status'            => in_array($_POST['status'] ?? '', ['draft', 'published', 'archived'], true) ? $_POST['status'] : 'draft',
        'is_featured'       => !empty($_POST['is_featured']) ? 1 : 0,
        'is_visible'        => !empty($_POST['is_visible']) ? 1 : 0,
    ];

    // Imágenes
    $urls = $_POST['img_url'] ?? [];
    $alts = $_POST['img_alt'] ?? [];
    $cover = (int) ($_POST['cover'] ?? -1);
    $coverUrl = null; $coverAlt = null; $sort = 0; $rows = [];
    foreach ($urls as $i => $u) {
        $u = trim((string) $u);
        if ($u === '') continue;
        $a = trim((string) ($alts[$i] ?? ''));
        $isCover = ($i === $cover) ? 1 : 0;
        $rows[] = ['url' => $u, 'alt' => $a, 'cover' => $isCover, 'sort' => $sort++];
        if ($isCover) { $coverUrl = $u; $coverAlt = $a; }
    }
    if (!$coverUrl && $rows) { $rows[0]['cover'] = 1; $coverUrl = $rows[0]['url']; $coverAlt = $rows[0]['alt']; }
    $fields['cover_image_url'] = $coverUrl;
    $fields['cover_image_alt'] = $coverAlt;

    try {
        $pdo = db();
        $pdo->beginTransaction();
        $cols = array_keys($fields);
        if ($id) {
            $set = implode(', ', array_map(fn($c) => "`$c` = ?", $cols));
            $pdo->prepare("UPDATE projects SET $set WHERE id = ?")->execute([...array_values($fields), $id]);
        } else {
            $max = (int) (q1("SELECT COALESCE(MAX(sort_order),0) m FROM projects")['m'] ?? 0);
            $fields['sort_order'] = $max + 1;
            $cols[] = 'sort_order';
            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $colSql = implode(', ', array_map(fn($c) => "`$c`", $cols));
            $pdo->prepare("INSERT INTO projects ($colSql) VALUES ($ph)")->execute(array_values($fields));
            $id = (int) $pdo->lastInsertId();
        }
        $pdo->prepare("DELETE FROM project_images WHERE project_id = ?")->execute([$id]);
        $ins = $pdo->prepare("INSERT INTO project_images (project_id, image_url, alt_text, is_cover, sort_order) VALUES (?, ?, ?, ?, ?)");
        foreach ($rows as $r) $ins->execute([$id, $r['url'], $r['alt'] ?: null, $r['cover'], $r['sort']]);
        $pdo->commit();
        flash('Proyecto guardado.');
        header('Location: proyectos.php');
        exit;
    } catch (Throwable $ex) {
        if (db()->inTransaction()) db()->rollBack();
        flash('No se pudo guardar (¿slug repetido?).', 'error');
        header('Location: ' . $_SERVER['REQUEST_URI']);
        exit;
    }
}

admin_header($id ? 'Editar proyecto' : 'Nuevo proyecto', $user);
$v = fn($k, $d = '') => e((string) ($p[$k] ?? $d));
?>
<div class="pagehead"><div><h1><?= $id ? 'Editar' : 'Nuevo' ?> proyecto</h1></div></div>
<form method="post" class="card">
  <?= csrf_field() ?>
  <div class="grid2">
    <div class="field"><label>Título <span class="req">*</span></label><input type="text" name="title" id="p-title" value="<?= $v('title') ?>" required></div>
    <div class="field"><label>Slug <span class="req">*</span></label><input type="text" name="slug" id="p-slug" value="<?= $v('slug') ?>"></div>
    <div class="field"><label>Categoría</label>
      <select name="category_id"><option value="">Sin categoría</option>
        <?php foreach ($cats as $c): ?><option value="<?= $c['id'] ?>" <?= ((int) ($p['category_id'] ?? 0) === (int) $c['id']) ? 'selected' : '' ?>><?= e($c['name']) ?></option><?php endforeach; ?>
      </select>
    </div>
    <div class="field"><label>Ubicación</label><input type="text" name="location" value="<?= $v('location') ?>"></div>
    <div class="field"><label>Cliente</label><input type="text" name="client_name" value="<?= $v('client_name') ?>"></div>
    <div class="field"><label>Fecha de finalización</label><input type="date" name="completion_date" value="<?= $v('completion_date') ?>"></div>
    <div class="field"><label>Estado</label>
      <select name="status">
        <?php foreach (['draft' => 'Borrador', 'published' => 'Publicado', 'archived' => 'Archivado'] as $sv => $sl): ?>
          <option value="<?= $sv ?>" <?= (($p['status'] ?? 'draft') === $sv) ? 'selected' : '' ?>><?= $sl ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <div class="field" style="display:flex;gap:24px;align-items:center;">
      <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="is_featured" value="1" style="width:auto;min-height:auto;" <?= !empty($p['is_featured']) ? 'checked' : '' ?>> Destacado</label>
      <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="is_visible" value="1" style="width:auto;min-height:auto;" <?= (!$id || !empty($p['is_visible'])) ? 'checked' : '' ?>> Visible</label>
    </div>
    <div class="field" style="grid-column:1 / -1;"><label>Descripción corta</label><textarea name="short_description"><?= $v('short_description') ?></textarea></div>
    <div class="field" style="grid-column:1 / -1;"><label>Descripción completa</label><textarea name="full_description" style="min-height:120px;"><?= $v('full_description') ?></textarea></div>
  </div>

  <hr style="border:none;border-top:1px solid rgba(5,5,5,.1);margin:20px 0;">
  <h2 style="font-size:16px;margin:0 0 12px;">Imágenes</h2>
  <p style="font-size:13px;color:#4d4d4e;margin:0 0 12px;">Marcá una como <strong>portada</strong>. Podés subir archivos o pegar rutas (ej. <code>images/foto.jpg</code>).</p>
  <div id="img-list">
    <?php foreach ($images as $i => $im): ?>
    <div class="field img-field" style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
      <img class="img-preview" src="<?= e(amedia($im['image_url'])) ?>" style="width:56px;height:42px;object-fit:cover;border-radius:8px;background:#eee;">
      <input type="text" name="img_url[]" class="img-url" value="<?= e($im['image_url']) ?>" placeholder="images/foto.jpg" style="flex:2;">
      <input type="text" name="img_alt[]" value="<?= e($im['alt_text']) ?>" placeholder="Texto alternativo" style="flex:2;">
      <label style="display:flex;align-items:center;gap:5px;font-size:12px;white-space:nowrap;"><input type="radio" name="cover" value="<?= $i ?>" <?= !empty($im['is_cover']) ? 'checked' : '' ?> style="width:auto;min-height:auto;">Portada</label>
      <label class="btn btn-ghost" style="cursor:pointer;padding:8px 10px;">Subir<input type="file" accept="image/*" class="img-file" hidden></label>
      <button type="button" class="iconbtn" onclick="this.closest('.img-field').remove()"><i data-lucide="trash-2"></i></button>
    </div>
    <?php endforeach; ?>
  </div>
  <button type="button" class="btn btn-ghost" id="add-img"><i data-lucide="plus"></i> Agregar imagen</button>

  <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px;">
    <a class="btn btn-ghost" href="proyectos.php">Cancelar</a>
    <button class="btn" type="submit"><?= $id ? 'Guardar cambios' : 'Crear proyecto' ?></button>
  </div>
</form>

<script>
// slug automático
(function(){
  var t=document.getElementById('p-title'), s=document.getElementById('p-slug');
  t.addEventListener('blur',function(){ if(!s.value.trim()) s.value=t.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); });
})();
// agregar fila de imagen
document.getElementById('add-img').addEventListener('click',function(){
  var list=document.getElementById('img-list');
  var i=list.querySelectorAll('.img-field').length;
  var div=document.createElement('div');
  div.className='field img-field';
  div.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:8px;';
  div.innerHTML='<img class="img-preview" src="" style="width:56px;height:42px;object-fit:cover;border-radius:8px;background:#eee;display:none;">'+
    '<input type="text" name="img_url[]" class="img-url" placeholder="images/foto.jpg" style="flex:2;">'+
    '<input type="text" name="img_alt[]" placeholder="Texto alternativo" style="flex:2;">'+
    '<label style="display:flex;align-items:center;gap:5px;font-size:12px;white-space:nowrap;"><input type="radio" name="cover" value="'+i+'" style="width:auto;min-height:auto;">Portada</label>'+
    '<label class="btn btn-ghost" style="cursor:pointer;padding:8px 10px;">Subir<input type="file" accept="image/*" class="img-file" hidden></label>'+
    '<button type="button" class="iconbtn" onclick="this.closest(\'.img-field\').remove()"><i data-lucide="trash-2"></i></button>';
  list.appendChild(div);
  if(window.lucide) lucide.createIcons();
});
</script>
<?php admin_footer(); ?>
