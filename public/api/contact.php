<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($pdo)) sendJson(['error' => 'Database not configured'], 500);
    
    $data = getJsonPayload();
    if (empty($data['name']) || empty($data['email']) || empty($data['content'])) {
        sendJson(['error' => 'All fields required'], 400);
    }
    
    $stmt = $pdo->prepare('INSERT INTO Message (name, email, content) VALUES (?, ?, ?)');
    $stmt->execute([$data['name'], $data['email'], $data['content']]);
    
    sendJson(['success' => true]);
}
?>
