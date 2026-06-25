<?php
require_once 'auth.php';

$CONFIG_FILE = '../site-config.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($CONFIG_FILE)) {
        sendJson(json_decode(file_get_contents($CONFIG_FILE), true));
    } else {
        // Return default configuration
        sendJson([
            'heroTitle' => 'Cyber Security Specialist & Developer',
            'heroSubtitle' => 'Building secure systems and scalable applications with modern technologies.',
            'aboutText' => "I'm a passionate developer and security enthusiast dedicated to creating robust, efficient, and secure digital solutions. With expertise across the full stack, I bridge the gap between development and security.",
            'contactEmail' => 'hello@example.com',
            'contactPhone' => '+880 1234 567890',
            'contactLocation' => 'Dhaka, Bangladesh',
            'footerText' => '© 2024 Mizanur Sajid. All rights reserved.'
        ]);
    }
}

// Write requires authentication
checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonPayload();
    if (!$data) {
        sendJson(['error' => 'Invalid data'], 400);
    }
    
    // Save to config file
    if (file_put_contents($CONFIG_FILE, json_encode($data, JSON_PRETTY_PRINT))) {
        logAdminAction("Site configuration updated");
        sendJson(['success' => true]);
    } else {
        logAdminAction("Failed to update site configuration");
        sendJson(['error' => 'Failed to save configuration'], 500);
    }
} else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>
