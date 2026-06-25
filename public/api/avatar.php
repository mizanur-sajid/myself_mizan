<?php
require_once 'auth.php';

checkAuth();

$avatarPath = '../admin-avatar.png';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
        logAdminAction("Failed avatar upload attempt");
        sendJson(['error' => 'No valid file uploaded'], 400);
    }
    
    $file = $_FILES['avatar'];
    
    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedMimes)) {
        logAdminAction("Blocked avatar upload with invalid MIME type: $mimeType");
        sendJson(['error' => 'Invalid image format. Only JPG, PNG, GIF, and WEBP are allowed.'], 400);
    }
    
    if (move_uploaded_file($file['tmp_name'], $avatarPath)) {
        logAdminAction("Avatar updated successfully");
        sendJson(['success' => true]);
    } else {
        logAdminAction("Failed to save avatar file");
        sendJson(['error' => 'Failed to save avatar'], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (file_exists($avatarPath)) {
        unlink($avatarPath);
    }
    logAdminAction("Avatar deleted");
    sendJson(['success' => true]);
}
?>
