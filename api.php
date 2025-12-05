<?php
// api.php - Endpoint API minimal
header('Content-Type: application/json');
header('Cache-Control: max-age=3600, public');
header('Access-Control-Allow-Origin: *');

// Activer la compression
if (extension_loaded('zlib') && !ob_start("ob_gzhandler")) {
    ob_start();
}

// Analyser la requête
$url = $_GET['url'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL invalide']);
    exit;
}

// Simuler un traitement (dans un cas réel, analyser l'URL)
sleep(1); // Simulation d'attente

// Données simulées
$parsedUrl = parse_url($url);
$hostname = $parsedUrl['host'] ?? 'unknown';

// Générer des données cohérentes basées sur l'URL
$hash = crc32($hostname);
srand($hash);

$data = [
    'url' => $hostname,
    'domElements' => rand(50, 500),
    'totalWeight' => rand(100, 10000), // KB
    'requests' => rand(5, 150),
    'timestamp' => time(),
    'analysisTime' => rand(500, 2000) // ms
];

// Calculer un score écologique
$score = 100 - (
    ($data['domElements'] / 500 * 30) +
    ($data['totalWeight'] / 10000 * 40) +
    ($data['requests'] / 150 * 30)
);
$data['ecoScore'] = max(10, min(100, round($score)));

// Calculer l'empreinte carbone (simulation)
$data['co2'] = [
    'perPageView' => round(($data['totalWeight'] * 0.0002) + ($data['requests'] * 0.001), 2),
    'unit' => 'gCO2e'
];

// Réponse
echo json_encode([
    'success' => true,
    'data' => $data,
    'metadata' => [
        'version' => '1.0',
        'generated' => date('c'),
        'cache' => '1 hour'
    ]
]);

// Fin du script
if (ob_get_length()) {
    ob_end_flush();
}
exit;