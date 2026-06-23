<?php
session_start();
require_once 'db.php';

$ADMIN_USERNAME = 'mizan';
$ADMIN_PASSWORD = '%(6LJM10x6£2';
$TIMEOUT_SECONDS = 300; // 5 minutes (300 seconds)

function checkAuth() {
    global $TIMEOUT_SECONDS;
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
        sendJson(['error' => 'Unauthorized'], 401);
    }
    
    // Check for 5 minutes inactivity
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $TIMEOUT_SECONDS)) {
        session_unset();
        session_destroy();
        sendJson(['error' => 'Session expired due to inactivity. Please log in again.'], 401);
    }
    
    // Update last activity timestamp to keep session alive
    $_SESSION['last_activity'] = time();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    if (isset($data['username']) && isset($data['password'])) {
        if ($data['username'] === $ADMIN_USERNAME && $data['password'] === $ADMIN_PASSWORD) {
            $_SESSION['is_admin'] = true;
            $_SESSION['last_activity'] = time();
            sendJson(['success' => true]);
        } else {
            sendJson(['error' => 'Invalid credentials'], 401);
        }
    } else {
        sendJson(['error' => 'Username and password required'], 400);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    session_destroy();
    sendJson(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    global $TIMEOUT_SECONDS;
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        // Enforce timeout on page reload check as well
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $TIMEOUT_SECONDS)) {
            session_unset();
            session_destroy();
            sendJson(['authenticated' => false], 401);
        } else {
            $_SESSION['last_activity'] = time();
            sendJson(['authenticated' => true]);
        }
    } else {
        sendJson(['authenticated' => false], 401);
    }
}
?>
