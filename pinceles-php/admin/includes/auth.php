<?php
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/functions.php';

function current_user(): ?array
{
    if (empty($_SESSION['uid'])) return null;
    return q1("SELECT * FROM admin_users WHERE id = ? AND is_active = 1", [$_SESSION['uid']]);
}

function require_login(): array
{
    $u = current_user();
    if (!$u) {
        header('Location: login.php');
        exit;
    }
    return $u;
}

function require_super(array $u): void
{
    if (($u['role'] ?? '') !== 'super_admin') {
        header('Location: index.php');
        exit;
    }
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function csrf_check(): void
{
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        http_response_code(419);
        exit('Sesión expirada. Volvé atrás y recargá la página.');
    }
}

function flash(string $msg, string $type = 'ok'): void
{
    $_SESSION['flash'] = ['msg' => $msg, 'type' => $type];
}

function get_flash(): ?array
{
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}

/** Ajusta una URL de imagen para mostrarla dentro del panel (que está en /admin/). */
function amedia(string $url): string
{
    if ($url === '') return '';
    if ($url[0] === '/' || preg_match('#^(https?:)?//#', $url)) return $url;
    return '../' . $url;
}
