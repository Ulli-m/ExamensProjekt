<?php
session_start();
require_once '../database.php'; 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Om det är en OPTIONS-request, svara och avsluta
}

// Läs in JSON-data från fetch-requesten
$data_raw = file_get_contents("php://input");
error_log("Mottagen data: " . $data_raw); // Logga den råa datan
$data = json_decode($data_raw, true);


if (!$data) {
    http_response_code(400);
    echo json_encode(["message" => "Ingen data mottagen"]);
    exit;
}


$frisor_id = $data['frisor_id'];
$behandling_id = $data['behandling_id'];
$datum = $data['datum'];
$tid = $data['tid'];
$status = $data['status'];
$kund_fornamn = $data['kund_fornamn'];
$kund_efternamn = $data['kund_efternamn'];
$kund_email = $data['kund_email'];
$kund_mobilnummer = $data['kund_mobilnummer'];
$kund_meddelande = $data['kund_meddelande'] ?? null; // valfritt

// Förbered och kör SQL-insert
$sql = "INSERT INTO bokningar (
    frisor_id, behandling_id, datum, tid, status, 
    kund_fornamn, kund_efternamn, kund_email, kund_mobilnummer, kund_meddelande
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "iissssssss",
    $frisor_id,
    $behandling_id,
    $datum,
    $tid,
    $status,
    $kund_fornamn,
    $kund_efternamn,
    $kund_email,
    $kund_mobilnummer,
    $kund_meddelande
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Bokning sparad"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Fel vid sparning: " . $stmt->error]);
}

$stmt->close();
$conn->close();
