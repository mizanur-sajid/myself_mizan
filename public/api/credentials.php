<?php
require_once 'auth.php';

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    if (!isset($data['username']) || !isset($data['newPassword']) || !isset($data['currentPassword'])) {
        logAdminAction("Failed credentials update: Missing fields");
        sendJson(['error' => 'All fields are required'], 400);
    }
    
    // Verify current password first
    global $ADMIN_PASSWORD_HASH;
    if (!password_verify($data['currentPassword'], $ADMIN_PASSWORD_HASH)) {
        logAdminAction("Failed credentials update: Invalid current password");
        sendJson(['error' => 'Current password is incorrect'], 401);
    }
    
    $newHash = password_hash($data['newPassword'], PASSWORD_BCRYPT);
    $CREDENTIALS_FILE = __DIR__ . '/admin-credentials.json';
    
    if (file_put_contents($CREDENTIALS_FILE, json_encode([
        'username' => $data['username'],
        'password_hash' => $newHash
    ]))) {
        logAdminAction("Admin credentials updated successfully");
        sendJson(['success' => true]);
    } else {
        logAdminAction("Failed to write to admin-credentials.json");
        sendJson(['error' => 'Failed to save credentials'], 500);
    }
} else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>
