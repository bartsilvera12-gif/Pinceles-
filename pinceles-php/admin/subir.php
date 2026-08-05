<?php
require_once __DIR__ . '/includes/auth.php';
require_login();
header('Content-Type: application/json');

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/avif' => 'avif'];
$MAX = 8 * 1024 * 1024;

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['ok' => false, 'error' => 'No se recibió el archivo.']);
    exit;
}
$file = $_FILES['file'];
if ($file['size'] > $MAX) {
    echo json_encode(['ok' => false, 'error' => 'El archivo supera 8 MB.']);
    exit;
}
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
if (!isset($allowed[$mime])) {
    echo json_encode(['ok' => false, 'error' => 'Formato no permitido (JPG, PNG, WebP, AVIF).']);
    exit;
}
$ext = $allowed[$mime];
$dir = __DIR__ . '/../uploads';
if (!is_dir($dir)) @mkdir($dir, 0755, true);
$name = 'img-' . bin2hex(random_bytes(8)) . '.' . $ext;
$dest = $dir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el archivo. Revisá permisos de la carpeta uploads/.']);
    exit;
}
// URL relativa (desde la raíz del sitio)
echo json_encode(['ok' => true, 'url' => 'uploads/' . $name]);
