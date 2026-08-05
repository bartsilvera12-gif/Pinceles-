<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/layout.php';
$user = require_login();
require_super($user);

function count_active_supers(): int
{
    return (int) (q1("SELECT COUNT(*) n FROM admin_users WHERE role='super_admin' AND is_active=1")['n'] ?? 0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = $_POST['action'] ?? '';
    if ($action === 'create') {
        $name = trim($_POST['full_name'] ?? '');
        $email = strtolower(trim($_POST['email'] ?? ''));
        $pass = $_POST['password'] ?? '';
        $role = ($_POST['role'] ?? 'editor') === 'super_admin' ? 'super_admin' : 'editor';
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
            flash('Datos inválidos (correo válido y contraseña de 8+).', 'error');
        } elseif (q1("SELECT id FROM admin_users WHERE email = ?", [$email])) {
            flash('Ya existe un usuario con ese correo.', 'error');
        } else {
            $st = db()->prepare("INSERT INTO admin_users (full_name,email,password_hash,role,is_active) VALUES (?,?,?,?,1)");
            $st->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $role]);
            flash('Usuario creado.');
        }
    } else {
        $id = (int) ($_POST['id'] ?? 0);
        $target = q1("SELECT * FROM admin_users WHERE id = ?", [$id]);
        if ($target && $id !== (int) $user['id']) {
            if ($action === 'role') {
                $role = ($_POST['role'] ?? 'editor') === 'super_admin' ? 'super_admin' : 'editor';
                if ($target['role'] === 'super_admin' && $role !== 'super_admin' && count_active_supers() <= 1) {
                    flash('No se puede degradar al último super administrador.', 'error');
                } else {
                    db()->prepare("UPDATE admin_users SET role = ? WHERE id = ?")->execute([$role, $id]);
                    flash('Rol actualizado.');
                }
            } elseif ($action === 'toggle') {
                if ($target['role'] === 'super_admin' && $target['is_active'] && count_active_supers() <= 1) {
                    flash('No se puede desactivar al último super administrador.', 'error');
                } else {
                    db()->prepare("UPDATE admin_users SET is_active = 1 - is_active WHERE id = ?")->execute([$id]);
                    flash('Usuario actualizado.');
                }
            } elseif ($action === 'delete') {
                if ($target['role'] === 'super_admin' && count_active_supers() <= 1) {
                    flash('No se puede eliminar al último super administrador.', 'error');
                } else {
                    db()->prepare("DELETE FROM admin_users WHERE id = ?")->execute([$id]);
                    flash('Usuario eliminado.');
                }
            }
        } else {
            flash('No podés modificar tu propia cuenta.', 'error');
        }
    }
    header('Location: usuarios.php');
    exit;
}

$users = q("SELECT * FROM admin_users ORDER BY id");
admin_header('Usuarios', $user);
?>
<div class="pagehead"><div><h1>Usuarios</h1><p>Administradores del panel.</p></div></div>

<div class="card" style="margin-bottom:18px;">
  <h2 style="font-size:16px;margin:0 0 12px;">Nuevo usuario</h2>
  <form method="post" class="grid2"><?= csrf_field() ?><input type="hidden" name="action" value="create">
    <div class="field"><label>Nombre</label><input name="full_name" required></div>
    <div class="field"><label>Correo</label><input type="email" name="email" required></div>
    <div class="field"><label>Contraseña (mín. 8)</label><input type="password" name="password" required minlength="8"></div>
    <div class="field"><label>Rol</label><select name="role"><option value="editor">Editor</option><option value="super_admin">Super admin</option></select></div>
    <div style="grid-column:1 / -1;text-align:right;"><button class="btn">Crear usuario</button></div>
  </form>
</div>

<?php foreach ($users as $u): $self = (int) $u['id'] === (int) $user['id']; ?>
<div class="row">
  <div class="grow"><b><?= e($u['full_name']) ?><?= $self ? ' (vos)' : '' ?></b><small><?= e($u['email']) ?></small></div>
  <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $u['id'] ?>"><input type="hidden" name="action" value="role">
    <select name="role" onchange="this.form.submit()" <?= $self ? 'disabled' : '' ?> style="min-height:40px;padding:8px;border-radius:9px;border:1px solid rgba(5,5,5,.16);">
      <option value="editor" <?= $u['role'] === 'editor' ? 'selected' : '' ?>>Editor</option>
      <option value="super_admin" <?= $u['role'] === 'super_admin' ? 'selected' : '' ?>>Super admin</option>
    </select>
  </form>
  <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $u['id'] ?>"><input type="hidden" name="action" value="toggle"><button class="btn btn-ghost" style="padding:8px 12px;color:<?= $u['is_active'] ? '#1f8a4c' : '#8a8a8a' ?>;" <?= $self ? 'disabled' : '' ?>><?= $u['is_active'] ? 'Activo' : 'Inactivo' ?></button></form>
  <form method="post" data-confirm="¿Eliminar a <?= e($u['email']) ?>?"><?= csrf_field() ?><input type="hidden" name="id" value="<?= $u['id'] ?>"><input type="hidden" name="action" value="delete"><button class="btn btn-danger" style="padding:8px 12px;" <?= $self ? 'disabled' : '' ?>>Eliminar</button></form>
</div>
<?php endforeach; ?>
<?php admin_footer(); ?>
