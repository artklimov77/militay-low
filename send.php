<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name    = isset($data['name'])    ? strip_tags(trim($data['name']))    : '';
$phone   = isset($data['phone'])   ? strip_tags(trim($data['phone']))   : '';
$topic   = isset($data['topic'])   ? strip_tags(trim($data['topic']))   : '';
$message = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

if (!$phone) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

mb_internal_encoding('UTF-8');

$subject = mb_encode_mimeheader('Новая заявка — воинское-право.рф', 'UTF-8', 'B');

$body  = "Новая заявка с сайта воинское-право.рф\r\n\r\n";
$body .= "Имя: $name\r\n";
$body .= "Телефон: $phone\r\n";
if ($topic)   $body .= "Тема: $topic\r\n";
if ($message) $body .= "Сообщение: $message\r\n";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: base64\r\n";
$headers .= "From: =?UTF-8?B?" . base64_encode('Сайт воинское-право.рф') . "?= <noreply@voennoe-pravo.ru>\r\n";

$encodedBody = chunk_split(base64_encode($body));

$recipients = ['prydovich@mail.ru', 'artklimov77@yandex.com'];
$ok = true;
foreach ($recipients as $to) {
    if (!mail($to, $subject, $encodedBody, $headers)) {
        $ok = false;
    }
}

echo json_encode(['ok' => $ok]);
