<?php
require_once 'auth.php';

$nameFile = '../admin-name.txt';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($nameFile)) {
        sendJson(['name' => trim(file_get_contents($nameFile))]);
    } else {
        sendJson(['name' => 'mizanursajid']);
    }
}

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    if (isset($data['name'])) {
        file_put_contents($nameFile, $data['name']);
        sendJson(['success' => true, 'name' => $data['name']]);
    } else {
        sendJson(['error' => 'Name required'], 400);
    }
}
?>
