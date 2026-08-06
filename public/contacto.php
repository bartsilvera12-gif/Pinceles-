<?php
/**
 * Pinceles — receptor del formulario de contacto para hosting estático (Hostinger).
 *
 * El sitio es HTML estático; este script PHP es el único trozo dinámico y solo
 * envía por email la solicitud del formulario. El canal principal sigue siendo
 * WhatsApp (el front abre WhatsApp igual, aunque este script falle).
 *
 * >>> AJUSTÁ ESTO: poné el correo donde querés recibir las solicitudes y una
 *     dirección "From" de TU dominio (Hostinger rechaza/marca como spam los
 *     From de dominios ajenos como @gmail).
 */
$TO   = 'admin@pinceles.com';          // <-- destino de las solicitudes
$FROM = 'no-reply@pinceles.com.py';    // <-- debe ser una casilla de tu dominio

header('Content-Type: application/json; charset=utf-8');

// Solo POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// Acepta JSON (fetch) o form-urlencoded.
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$field = function (string $k) use ($data): string {
    return isset($data[$k]) ? trim((string) $data[$k]) : '';
};

// Honeypot: si viene relleno, es un bot. Respondemos ok y descartamos.
if ($field('website') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name  = $field('name');
$phone = $field('phone');

// Validación mínima.
if ($name === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos obligatorios (nombre y teléfono).']);
    exit;
}

$rows = [
    'Nombre'    => $name,
    'Empresa'   => $field('company'),
    'Teléfono'  => $phone,
    'Correo'    => $field('email'),
    'Servicio'  => $field('serviceName'),
    'Ubicación' => $field('location'),
    'Mensaje'   => $field('message'),
];

$body = "Nueva solicitud desde el sitio web:\n\n";
foreach ($rows as $label => $value) {
    if ($value !== '') {
        $body .= $label . ': ' . $value . "\n";
    }
}
$body .= "\n— Enviado automáticamente por contacto.php";

$subject = 'Nueva solicitud de presupuesto — ' . $name;

// Cabeceras. Reply-To al correo del visitante (si lo dejó) para responderle.
$headers = [];
$headers[] = 'From: Pinceles <' . $FROM . '>';
$visitorEmail = $field('email');
if ($visitorEmail !== '' && filter_var($visitorEmail, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $visitorEmail;
}
$headers[] = 'Content-Type: text/plain; charset=utf-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = @mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

// Aunque mail() falle, el front ya deriva a WhatsApp; devolvemos el estado real.
echo json_encode(['ok' => (bool) $sent]);
