<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();
require_once 'db.php';

$ADMIN_USERNAME = 'mizan';
// In a production environment, generate the hash once and store it as a string.
$ADMIN_PASSWORD_HASH = password_hash('%(6LJM10x6£2', PASSWORD_BCRYPT);
$TIMEOUT_SECONDS = 300; // 5 minutes (300 seconds)
$MAX_ATTEMPTS = 5;
$LOCKOUT_TIME = 900; // 15 minutes

function getClientIp() {
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function logAdminAction($action) {
    $ip = getClientIp();
    $date = date('Y-m-d H:i:s');
    $logEntry = "[$date] IP: $ip - ACTION: $action\n";
    file_put_contents(__DIR__ . '/admin_audit.log', $logEntry, FILE_APPEND);
}

function checkLockout() {
    global $MAX_ATTEMPTS, $LOCKOUT_TIME;
    $ip = getClientIp();
    $file = __DIR__ . '/lockout.json';
    if (!file_exists($file)) return false;
    
    $data = json_decode(file_get_contents($file), true) ?: [];
    if (isset($data[$ip])) {
        if ($data[$ip]['attempts'] >= $MAX_ATTEMPTS) {
            if (time() - $data[$ip]['time'] < $LOCKOUT_TIME) {
                return true; // Locked out
            } else {
                unset($data[$ip]);
                file_put_contents($file, json_encode($data));
                return false;
            }
        }
    }
    return false;
}

function recordFailedAttempt() {
    $ip = getClientIp();
    $file = __DIR__ . '/lockout.json';
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) ?: [] : [];
    
    if (!isset($data[$ip])) {
        $data[$ip] = ['attempts' => 0, 'time' => time()];
    }
    $data[$ip]['attempts']++;
    $data[$ip]['time'] = time();
    file_put_contents($file, json_encode($data));
}

function resetFailedAttempts() {
    $ip = getClientIp();
    $file = __DIR__ . '/lockout.json';
    if (!file_exists($file)) return;
    $data = json_decode(file_get_contents($file), true) ?: [];
    if (isset($data[$ip])) {
        unset($data[$ip]);
        file_put_contents($file, json_encode($data));
    }
}

function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken() {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        logAdminAction("Failed CSRF verification for " . $_SERVER['REQUEST_URI']);
        sendJson(['error' => 'Invalid CSRF token'], 403);
    }
}

function checkAuth() {
    global $TIMEOUT_SECONDS;
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
        sendJson(['error' => 'Unauthorized'], 401);
    }
    
    // Check for 5 minutes inactivity
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $TIMEOUT_SECONDS)) {
        session_unset();
        session_destroy();
        logAdminAction("Session expired");
        sendJson(['error' => 'Session expired due to inactivity. Please log in again.'], 401);
    }
    
    // Update last activity timestamp to keep session alive
    $_SESSION['last_activity'] = time();
    
    // CSRF and Action Logging for state-changing requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        verifyCsrfToken();
        logAdminAction($_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
    }
}

if (realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = getJsonPayload();
        if (isset($data['username']) && isset($data['password'])) {
            if (checkLockout()) {
                logAdminAction("Login attempt blocked by lockout");
                sendJson(['error' => 'Too many failed attempts. Try again later.'], 429);
            }
            
            if ($data['username'] === $ADMIN_USERNAME && password_verify($data['password'], $ADMIN_PASSWORD_HASH)) {
                resetFailedAttempts();
                $_SESSION['is_admin'] = true;
                $_SESSION['last_activity'] = time();
                $csrfToken = generateCsrfToken();
                logAdminAction("Successful login");
                sendJson(['success' => true, 'csrf_token' => $csrfToken]);
            } else {
                recordFailedAttempt();
                logAdminAction("Failed login attempt for username: " . $data['username']);
                sendJson(['error' => 'Invalid credentials'], 401);
            }
        } else {
            sendJson(['error' => 'Username and password required'], 400);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        verifyCsrfToken();
        logAdminAction("Successful logout");
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
                sendJson(['authenticated' => true, 'csrf_token' => $_SESSION['csrf_token'] ?? generateCsrfToken()]);
            }
        } else {
            sendJson(['authenticated' => false], 401);
        }
    }
}
?>
