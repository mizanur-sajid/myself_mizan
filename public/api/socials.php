<?php
require_once 'db.php';
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($pdo)) sendJson([]);
    $stmt = $pdo->query('SELECT * FROM Social');
    sendJson($stmt->fetchAll());
}

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    $stmt = $pdo->prepare('INSERT INTO Social (name, url, icon) VALUES (?, ?, ?)');
    $stmt->execute([
        $data['name'] ?? '',
        $data['url'] ?? '',
        $data['icon'] ?? 'link'
    ]);
    $data['id'] = $pdo->lastInsertId();
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    $stmt = $pdo->prepare('UPDATE Social SET name=?, url=?, icon=? WHERE id=?');
    $stmt->execute([
        $data['name'] ?? '',
        $data['url'] ?? '',
        $data['icon'] ?? 'link',
        $data['id']
    ]);
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    $stmt = $pdo->prepare('DELETE FROM Social WHERE id=?');
    $stmt->execute([$data['id']]);
    sendJson(['success' => true]);
}
?>
