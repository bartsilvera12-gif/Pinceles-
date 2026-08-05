<?php
require_once __DIR__ . '/includes/auth.php';

if (current_user()) {
    header('Location: index.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $pass = $_POST['password'] ?? '';
    $u = q1("SELECT * FROM admin_users WHERE email = ? AND is_active = 1", [$email]);
    if ($u && password_verify($pass, $u['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['uid'] = $u['id'];
        db()->prepare("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?")->execute([$u['id']]);
        header('Location: index.php');
        exit;
    }
    $error = 'Credenciales inválidas.';
}
?>
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Ingresar · Panel Pinceles</title><link rel="stylesheet" href="assets/admin.css"></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div class="card" style="max-width:400px;width:100%;">
  <img src="../images/logo-pinceles.jpg" alt="Pinceles" style="height:52px;width:auto;mix-blend-mode:multiply;">
  <h1 style="font-size:24px;margin:18px 0 6px;">Panel administrativo</h1>
  <p style="color:#4d4d4e;font-size:14px;margin:0 0 18px;">Ingresá con tu cuenta.</p>
  <?php if ($error): ?><p style="color:#b23b2f;font-weight:600;"><?= e($error) ?></p><?php endif; ?>
  <form method="post">
    <div class="field"><label>Correo</label><input type="email" name="email" required autocomplete="email"></div>
    <div class="field"><label>Contraseña</label><input type="password" name="password" required autocomplete="current-password"></div>
    <button class="btn" type="submit" style="width:100%;justify-content:center;">Ingresar</button>
  </form>
</div>
</body></html>
