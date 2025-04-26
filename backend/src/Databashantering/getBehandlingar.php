<?php
session_start();
require_once '../database.php'; 


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");



// Hämta behandlingar
$sql = "SELECT * FROM behandling";
$result = $conn->query($sql);

// Skapa en array för resultat
$behandlingar = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $behandlingar[] = $row;
    }
}

// Skicka resultatet som JSON
echo json_encode($behandlingar);

// Stäng anslutningen
$conn->close();
?>


