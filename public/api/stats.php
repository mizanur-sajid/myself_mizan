<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($pdo)) sendJson(['views' => 0]);
    $stmt = $pdo->query('SELECT views FROM SiteStat WHERE id=1');
    $result = $stmt->fetch();
    sendJson(['views' => $result ? $result['views'] : 0]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($pdo)) sendJson(['success' => false]);
    // Atomic increment
    $pdo->exec('UPDATE SiteStat SET views = views + 1 WHERE id=1');
    sendJson(['success' => true]);
}
?>
