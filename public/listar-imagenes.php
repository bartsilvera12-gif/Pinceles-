<?php
/**
 * Pinceles — lista las imágenes subidas por el panel (carpeta /uploads/).
 * Devuelve JSON con las imágenes de cada subcarpeta permitida.
 * Solo lectura; sin claves ni datos sensibles.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$baseDir = __DIR__ . '/uploads';
$folders = ['general', 'projects', 'hero', 'about', 'testimonials'];
$exts = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
$files = [];

if (is_dir($baseDir)) {
    foreach ($folders as $folder) {
        $dir = $baseDir . '/' . $folder;
        if (!is_dir($dir)) {
            continue;
        }
        foreach (scandir($dir) as $f) {
            if ($f === '.' || $f === '..') {
                continue;
            }
            $path = $dir . '/' . $f;
            if (!is_file($path)) {
                continue;
            }
            $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
            if (!in_array($ext, $exts, true)) {
                continue;
            }
            $files[] = [
                'name'   => $f,
                'folder' => $folder,
                'url'    => '/uploads/' . $folder . '/' . $f,
                'mtime'  => filemtime($path),
            ];
        }
    }
    usort($files, function ($a, $b) {
        return $b['mtime'] - $a['mtime'];
    });
}

echo json_encode(['ok' => true, 'files' => $files]);
