<?php
/**
 * Pinceles — subida de imágenes para el panel admin en hosting estático.
 *
 * El navegador NO puede subir directo a Supabase Storage (CORS del servidor),
 * así que el panel sube el archivo AQUÍ (mismo dominio, sin CORS) y este script
 * lo guarda en /uploads/ y devuelve la URL pública (/uploads/...).
 *
 * IMPORTANTE: no borres la carpeta "uploads" al re-subir el sitio; ahí quedan
 * las imágenes cargadas desde el panel.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No se recibió el archivo.']);
    exit;
}

$file = $_FILES['file'];

// Tamaño máximo: 8 MB.
if ($file['size'] > 8 * 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'El archivo supera 8 MB.']);
    exit;
}

// Validar tipo real por contenido (no confiar en la extensión enviada).
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/avif' => 'avif',
];
if (!isset($allowed[$mime])) {
    http_response_code(415);
    echo json_encode(['ok' => false, 'error' => 'Formato no permitido (JPG, PNG, WebP o AVIF).']);
    exit;
}
$ext = $allowed[$mime];

// Carpeta destino: /uploads/<folder>/  (folder acotado por seguridad).
$folderRaw = isset($_POST['folder']) ? (string) $_POST['folder'] : 'general';
$allowedFolders = ['hero', 'about', 'projects', 'testimonials', 'general'];
$folder = in_array($folderRaw, $allowedFolders, true) ? $folderRaw : 'general';

$baseDir = __DIR__ . '/uploads';
$destDir = $baseDir . '/' . $folder;
if (!is_dir($destDir) && !mkdir($destDir, 0755, true) && !is_dir($destDir)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo crear la carpeta de destino.']);
    exit;
}

// Nombre único.
try {
    $rand = bin2hex(random_bytes(16));
} catch (Exception $e) {
    $rand = uniqid('', true);
}
$name = $rand . '.' . $ext;
$dest = $destDir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el archivo.']);
    exit;
}

$url = '/uploads/' . $folder . '/' . $name;
echo json_encode(['ok' => true, 'url' => $url]);
