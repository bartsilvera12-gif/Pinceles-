<?php
/**
 * Pinceles — elimina una imagen subida por el panel (carpeta /uploads/).
 * Recibe { url: "/uploads/<folder>/<name>" } por POST. Valida la ruta para
 * evitar path traversal; solo borra dentro de /uploads/.
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$url = isset($_POST['url']) ? (string) $_POST['url'] : '';
if (!preg_match('#^/uploads/(hero|about|projects|testimonials|general)/[A-Za-z0-9._-]+$#', $url)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'URL inválida.']);
    exit;
}

$base = realpath(__DIR__ . '/uploads');
$path = realpath(__DIR__ . $url);
if ($base === false || $path === false || strpos($path, $base) !== 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Ruta inválida.']);
    exit;
}

if (!@unlink($path)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo eliminar el archivo.']);
    exit;
}

echo json_encode(['ok' => true]);
