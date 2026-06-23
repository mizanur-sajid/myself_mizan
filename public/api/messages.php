<?php
require_once 'db.php';
require_once 'auth.php';

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($pdo)) sendJson([]);
    $stmt = $pdo->query('SELECT * FROM Message WHERE deleted=0 ORDER BY createdAt DESC');
    sendJson($stmt->fetchAll());
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    
    // Toggle archived status
    if (isset($data['archived'])) {
        $stmt = $pdo->prepare('UPDATE Message SET archived=? WHERE id=?');
        $stmt->execute([$data['archived'] ? 1 : 0, $data['id']]);
        sendJson(['success' => true]);
    }
    
    // Soft delete
    if (isset($data['deleted'])) {
        $stmt = $pdo->prepare('UPDATE Message SET deleted=? WHERE id=?');
        $stmt->execute([$data['deleted'] ? 1 : 0, $data['id']]);
        sendJson(['success' => true]);
    }
    
    sendJson(['error' => 'Invalid action'], 400);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonPayload();
    if (!isset($data['id'])) sendJson(['error' => 'ID required'], 400);
    $stmt = $pdo->prepare('DELETE FROM Message WHERE id=?');
    $stmt->execute([$data['id']]);
    sendJson(['success' => true]);
}
?>
