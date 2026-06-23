<?php
// Prevent CORS issues during local testing
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost'; // Change this to InfinityFree MySQL hostname (e.g., sql123.epizy.com)
$db   = 'database_name'; // Change to InfinityFree Database Name
$user = 'database_user'; // Change to InfinityFree Username
$pass = 'database_password'; // Change to InfinityFree Password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Only connect if db is configured (avoids crashing during simple tests)
    if ($db !== 'database_name') {
        $pdo = new PDO($dsn, $user, $pass, $options);
    }
} catch (\PDOException $e) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Helper function to send JSON response
function sendJson($data, $statusCode = 200) {
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper to get raw JSON payload
function getJsonPayload() {
    return json_decode(file_get_contents('php://input'), true);
}
?>
