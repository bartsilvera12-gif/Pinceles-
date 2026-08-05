<?php
require_once __DIR__ . '/includes/auth.php';

// Si ya existe algún administrador, este script queda deshabilitado.
$count = (int) (q1("SELECT COUNT(*) AS n FROM admin_users")['n'] ?? 0);
$done = false;
$error = '';

if ($count > 0) {
    $error = 'Ya existe un administrador. Este asistente está deshabilitado. Por seguridad, borrá el archivo admin/setup.php.';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['full_name'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $pass = $_POST['password'] ?? '';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
        $error = 'Completá nombre, un correo válido y una contraseña de al menos 8 caracteres.';
    } else {
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $st = db()->prepare("INSERT INTO admin_users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'super_admin', 1)");
        $st->execute([$name, $email, $hash]);
        $done = true;
    }
}
?>
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Configuración inicial · Pinceles</title><link rel="stylesheet" href="assets/admin.css"></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div class="card" style="max-width:420px;width:100%;">
  <h1 style="font-size:24px;margin:0 0 6px;">Crear administrador</h1>
  <?php if ($done): ?>
    <p style="color:#1f8a4c;font-weight:600;">✓ Administrador creado. Por seguridad, <strong>borrá ahora el archivo <code>admin/setup.php</code></strong>.</p>
    <a class="btn btn-dark" href="login.php">Ir al login</a>
  <?php else: ?>
    <?php if ($error): ?><p style="color:#b23b2f;font-weight:600;"><?= e($error) ?></p><?php endif; ?>
    <?php if ($count === 0): ?>
    <p style="color:#4d4d4e;font-size:14px;">Creá el primer administrador (super admin). Después borrá este archivo.</p>
    <form method="post">
      <div class="field"><label>Nombre completo</label><input name="full_name" required></div>
      <div class="field"><label>Correo</label><input type="email" name="email" required placeholder="admin@pinceles.com"></div>
      <div class="field"><label>Contraseña (mín. 8)</label><input type="password" name="password" required minlength="8"></div>
      <button class="btn" type="submit">Crear administrador</button>
    </form>
    <?php endif; ?>
  <?php endif; ?>
</div>
</body></html>
