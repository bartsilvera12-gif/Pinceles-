<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/data.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

// Honeypot anti-spam
if (!empty($_POST['website'])) {
    header('Location: index.php');
    exit;
}

$nombre    = trim($_POST['nombre'] ?? '');
$empresa   = trim($_POST['empresa'] ?? '');
$telefono  = trim($_POST['telefono'] ?? '');
$correo    = trim($_POST['correo'] ?? '');
$ubicacion = trim($_POST['ubicacion'] ?? '');
$servicio  = trim($_POST['servicio'] ?? '');
$mensaje   = trim($_POST['mensaje'] ?? '');

// Validación mínima
$digits = preg_replace('/\D/', '', $telefono);
if ($nombre === '' || strlen($digits) < 7) {
    header('Location: index.php?error=1#contacto');
    exit;
}

// Guardar la solicitud
try {
    $st = db()->prepare(
        "INSERT INTO contact_submissions (name, company, phone, email, service_name_snapshot, location, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $st->execute([
        $nombre,
        $empresa ?: null,
        $telefono,
        $correo ?: null,
        $servicio ?: null,
        $ubicacion ?: null,
        $mensaje ?: null,
    ]);
} catch (Throwable $e) {
    // No bloquear el envío por WhatsApp aunque falle el guardado.
}

// Armar mensaje de WhatsApp
$s = q1("SELECT whatsapp_number, whatsapp_default_message FROM site_settings LIMIT 1") ?? [];
$lineas = array_filter([
    $s['whatsapp_default_message'] ?? 'Hola, quisiera solicitar un presupuesto.',
    'Nombre: ' . $nombre,
    $empresa ? 'Empresa: ' . $empresa : '',
    'Teléfono: ' . $telefono,
    $correo ? 'Correo: ' . $correo : '',
    $servicio ? 'Servicio: ' . $servicio : '',
    $ubicacion ? 'Ubicación: ' . $ubicacion : '',
    $mensaje ? 'Detalle: ' . $mensaje : '',
]);

$url = wa_url($s['whatsapp_number'] ?? '', implode("\n", $lineas));
header('Location: ' . $url);
exit;
