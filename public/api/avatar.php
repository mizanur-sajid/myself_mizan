<?php
require_once 'auth.php';

checkAuth();

$avatarPath = '../admin-avatar.png';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['avatar'])) {
        sendJson(['error' => 'No file uploaded'], 400);
    }
    
    $file = $_FILES['avatar'];
    if (move_uploaded_file($file['tmp_name'], $avatarPath)) {
        sendJson(['success' => true]);
    } else {
        sendJson(['error' => 'Failed to save avatar'], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (file_exists($avatarPath)) {
        unlink($avatarPath);
    }
    sendJson(['success' => true]);
}
?>
