<?php
require_once 'db.php';
require_once 'auth.php';

// Public GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($pdo)) sendJson([]);
    $stmt = $pdo->query('SELECT * FROM Skill ORDER BY category DESC, name ASC');
    sendJson($stmt->fetchAll());
}

// Protected requests
checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    $stmt = $pdo->prepare('INSERT INTO Skill (name, level, category, icon, description) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['name'] ?? '',
        $data['level'] ?? 50,
        $data['category'] ?? 'Technical Skills',
        $data['icon'] ?? 'code',
        $data['description'] ?? null
    ]);
    
    $data['id'] = $pdo->lastInsertId();
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    
    $stmt = $pdo->prepare('UPDATE Skill SET name=?, level=?, category=?, icon=?, description=? WHERE id=?');
    $stmt->execute([
        $data['name'] ?? '',
        $data['level'] ?? 50,
        $data['category'] ?? 'Technical Skills',
        $data['icon'] ?? 'code',
        $data['description'] ?? null,
        $data['id']
    ]);
    sendJson($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    
    $stmt = $pdo->prepare('DELETE FROM Skill WHERE id=?');
    $stmt->execute([$data['id']]);
    sendJson(['success' => true]);
}
?>
