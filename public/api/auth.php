<?php
session_start();
require_once 'db.php';

// NOTE: Hardcoded password for InfinityFree
// Please change this to a secure password before uploading!
$ADMIN_PASSWORD = 'admin'; 

function checkAuth() {
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
        sendJson(['error' => 'Unauthorized'], 401);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    if (isset($data['password'])) {
        if ($data['password'] === $ADMIN_PASSWORD) {
            $_SESSION['is_admin'] = true;
            sendJson(['success' => true]);
        } else {
            sendJson(['error' => 'Invalid credentials'], 401);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    session_destroy();
    sendJson(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        sendJson(['authenticated' => true]);
    } else {
        sendJson(['authenticated' => false], 401);
    }
}
?>
