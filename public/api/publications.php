<?php
require_once 'db.php';
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($pdo)) sendJson([]);
    $stmt = $pdo->query('SELECT * FROM Publication ORDER BY year DESC');
    sendJson($stmt->fetchAll());
}

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    $stmt = $pdo->prepare('INSERT INTO Publication (title, link, year, description, fileUrl) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['title'] ?? '',
        $data['link'] ?? '',
        $data['year'] ?? (int)date('Y'),
        $data['description'] ?? null,
        $data['fileUrl'] ?? null
    ]);
    $data['id'] = $pdo->lastInsertId();
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    $stmt = $pdo->prepare('UPDATE Publication SET title=?, link=?, year=?, description=?, fileUrl=? WHERE id=?');
    $stmt->execute([
        $data['title'] ?? '',
        $data['link'] ?? '',
        $data['year'] ?? (int)date('Y'),
        $data['description'] ?? null,
        $data['fileUrl'] ?? null,
        $data['id']
    ]);
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    $stmt = $pdo->prepare('DELETE FROM Publication WHERE id=?');
    $stmt->execute([$data['id']]);
    sendJson(['success' => true]);
}
?>
