<?php
require_once 'auth.php';

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        sendJson(['error' => 'No file uploaded'], 400);
    }
    
    $file = $_FILES['file'];
    
    // Create uploads directory outside the api folder but inside public (for access)
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique name to prevent overwriting
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $targetPath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        sendJson(['url' => '/uploads/' . $filename]);
    } else {
        sendJson(['error' => 'Failed to move uploaded file'], 500);
    }
}
?>
