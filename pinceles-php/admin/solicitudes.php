<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();

$STATUSES = ['nuevo', 'contactado', 'cotizado', 'aprobado', 'cerrado', 'descartado'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'status' && in_array($_POST['status'] ?? '', $STATUSES, true)) {
        db()->prepare("UPDATE contact_submissions SET status = ? WHERE id = ?")->execute([$_POST['status'], $id]);
        flash('Estado actualizado.');
    } elseif (($_POST['action'] ?? '') === 'notes') {
        db()->prepare("UPDATE contact_submissions SET internal_notes = ? WHERE id = ?")->execute([trim($_POST['notes'] ?? '') ?: null, $id]);
        flash('Notas guardadas.');
    }
    header('Location: solicitudes.php');
    exit;
}

$search = trim($_GET['q'] ?? '');
$fstatus = $_GET['status'] ?? '';
$sql = "SELECT * FROM contact_submissions WHERE 1=1";
$params = [];
if ($search !== '') { $sql .= " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR company LIKE ?)"; $like = '%' . $search . '%'; array_push($params, $like, $like, $like, $like); }
if ($fstatus !== '' && in_array($fstatus, $STATUSES, true)) { $sql .= " AND status = ?"; $params[] = $fstatus; }
$sql .= " ORDER BY created_at DESC";
$rows = q($sql, $params);

// Export CSV
if (($_GET['export'] ?? '') === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="solicitudes-pinceles.csv"');
    $out = fopen('php://output', 'w');
    fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM
    fputcsv($out, ['Fecha', 'Nombre', 'Empresa', 'Teléfono', 'Correo', 'Servicio', 'Ubicación', 'Estado', 'Mensaje']);
    foreach ($rows as $r) {
        fputcsv($out, [$r['created_at'], $r['name'], $r['company'], $r['phone'], $r['email'], $r['service_name_snapshot'], $r['location'], $r['status'], str_replace("\n", ' ', (string) $r['message'])]);
    }
    fclose($out);
    exit;
}

admin_header('Solicitudes', $user);
?>
<div class="pagehead"><div><h1>Solicitudes</h1><p>Consultas recibidas desde el formulario.</p></div></div>
<form class="toolbar" method="get">
  <input type="text" name="q" value="<?= e($search) ?>" placeholder="Buscar…" style="flex:1 1 200px;">
  <select name="status"><option value="">Todos los estados</option><?php foreach ($STATUSES as $s): ?><option value="<?= $s ?>" <?= $fstatus === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?></select>
  <button class="btn btn-ghost" type="submit">Filtrar</button>
  <a class="btn btn-ghost" href="?export=csv<?= $fstatus ? '&status=' . e($fstatus) : '' ?><?= $search ? '&q=' . urlencode($search) : '' ?>">Exportar CSV</a>
</form>

<?php if (!$rows): ?><p style="color:#8a8a8a;">No hay solicitudes.</p><?php endif; ?>
<?php foreach ($rows as $r): $wa = wa_url($r['phone']); ?>
<div class="card" style="margin-bottom:10px;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
    <div class="grow" style="flex:1 1 200px;">
      <b style="font-size:15px;"><?= e($r['name']) ?><?= $r['company'] ? ' · ' . e($r['company']) : '' ?></b>
      <div style="font-size:13px;color:#4d4d4e;"><?= e($r['phone']) ?><?= $r['email'] ? ' · ' . e($r['email']) : '' ?><?= $r['location'] ? ' · ' . e($r['location']) : '' ?></div>
      <div style="font-size:12px;color:#8a8a8a;"><?= e($r['created_at']) ?><?= $r['service_name_snapshot'] ? ' · ' . e($r['service_name_snapshot']) : '' ?></div>
    </div>
    <form method="post" style="display:flex;gap:6px;align-items:center;"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="status">
      <select name="status" onchange="this.form.submit()" style="min-height:40px;padding:8px;border-radius:9px;border:1px solid rgba(5,5,5,.16);">
        <?php foreach ($STATUSES as $s): ?><option value="<?= $s ?>" <?= $r['status'] === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?>
      </select>
    </form>
    <a class="btn btn-ghost" style="padding:8px 12px;" href="<?= e($wa) ?>" target="_blank" rel="noopener">WhatsApp</a>
  </div>
  <?php if ($r['message']): ?><p style="margin:10px 0 0;font-size:14px;background:#F8F6F1;border-radius:10px;padding:10px 12px;"><?= e($r['message']) ?></p><?php endif; ?>
  <details style="margin-top:8px;"><summary style="cursor:pointer;font-size:13px;font-weight:600;">Notas internas</summary>
    <form method="post" style="margin-top:8px;"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $r['id'] ?>"><input type="hidden" name="action" value="notes">
      <textarea name="notes" rows="2" style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(5,5,5,.16);"><?= e($r['internal_notes']) ?></textarea>
      <div style="text-align:right;margin-top:6px;"><button class="btn" style="padding:8px 16px;">Guardar notas</button></div>
    </form>
  </details>
</div>
<?php endforeach; ?>
<?php admin_footer(); ?>
