<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function salir($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['ok' => $codigo < 400, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') salir(405, 'Método no permitido.');
if (!empty($_POST['sitio_web'])) salir(200, '¡Mensaje enviado!'); // trampa para bots

$cfg = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];

$nombre  = trim((string)($_POST['nombre']  ?? ''));
$correo  = trim((string)($_POST['correo']  ?? ''));
$telefono = trim((string)($_POST['telefono'] ?? ''));
$asunto  = 'Consulta desde el portafolio';
$mensaje = trim((string)($_POST['mensaje'] ?? ''));

if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 80)       salir(422, 'Escribe un nombre válido.');
if (!filter_var($correo, FILTER_VALIDATE_EMAIL))               salir(422, 'Escribe un correo válido.');
if (!preg_match('/^[0-9+\s()-]{6,20}$/', $telefono))          salir(422, 'Escribe un teléfono válido.');
if (mb_strlen($mensaje) < 10 || mb_strlen($mensaje) > 2000)   salir(422, 'El mensaje debe tener entre 10 y 2000 caracteres.');

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$guardado = false;

if (!empty($cfg['db'])) {
    try {
        $d = $cfg['db'];
        $pdo = new PDO("mysql:host={$d['host']};dbname={$d['nombre']};charset=utf8mb4", $d['usuario'], $d['clave'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $pdo->prepare('INSERT INTO mensajes (nombre, correo, telefono, asunto, mensaje, ip) VALUES (?,?,?,?,?,?)')
            ->execute([$nombre, $correo, $telefono, $asunto, $mensaje, $ip]);
        $guardado = true;
    } catch (Throwable $e) {  }
}

if (!$guardado) {
    $linea = json_encode(['fecha' => date('c'), 'nombre' => $nombre, 'correo' => $correo, 'telefono' => $telefono,
        'asunto' => $asunto, 'mensaje' => $mensaje, 'ip' => $ip], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    $guardado = @file_put_contents(__DIR__ . '/storage/mensajes.log', $linea, FILE_APPEND | LOCK_EX) !== false;
}

if (!empty($cfg['correo_destino'])) {
    $cabeceras = "From: Portafolio <no-responder@{$_SERVER['HTTP_HOST']}>\r\nReply-To: $correo\r\nContent-Type: text/plain; charset=UTF-8";
    @mail($cfg['correo_destino'], '=?UTF-8?B?' . base64_encode("Portafolio: $asunto") . '?=',
        "De: $nombre <$correo>\nTeléfono: $telefono\n\n$mensaje", $cabeceras);
}

if (!$guardado) salir(500, 'No se pudo guardar el mensaje.');
salir(200, '¡Gracias! Recibí tu mensaje y te responderé pronto.');
