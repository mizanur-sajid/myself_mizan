<?php
require_once 'auth.php';

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        logAdminAction("Failed file upload attempt");
        sendJson(['error' => 'No valid file uploaded'], 400);
    }
    
    $file = $_FILES['file'];
    
    // Allowed extensions and MIME types
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'zip'];
    $allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip', 'application/x-zip-compressed'
    ];
    
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Check extension
    if (!in_array($ext, $allowedExts)) {
        logAdminAction("Blocked file upload with invalid extension: $ext");
        sendJson(['error' => 'Invalid file type'], 400);
    }
    
    // Check MIME type using finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedMimes)) {
        logAdminAction("Blocked file upload with invalid MIME type: $mimeType");
        sendJson(['error' => 'Invalid file content'], 400);
    }
    
    // Create uploads directory outside the api folder but inside public (for access)
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique name to prevent overwriting
    $filename = uniqid() . '.' . $ext;
    $targetPath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        logAdminAction("Uploaded file: $filename");
        sendJson(['url' => '/uploads/' . $filename]);
    } else {
        logAdminAction("Failed to move uploaded file");
        sendJson(['error' => 'Failed to move uploaded file'], 500);
    }
}
?>
