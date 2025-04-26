<?php
session_start();
require_once '../database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");


$frisor_id = $_GET['frisor_id'] ?? null;
$behandling_id = $_GET['behandling_id'] ?? null;
$start = $_GET['start'] ?? null;
$slut = $_GET['slut'] ?? null;

if (!$frisor_id || !$behandling_id || !$start || !$slut) {
    http_response_code(400);
    echo json_encode(["error" => "Ogiltiga eller saknade parametrar"]);
    exit;
}

try {
    // 1. Hämta varaktighet för vald behandling
    $stmt = $conn->prepare("SELECT varaktighet FROM behandling WHERE id = ?");
    $stmt->bind_param("i", $behandling_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (!$row) throw new Exception("Behandling hittades inte.");
    $valdVaraktighet = (int)$row['varaktighet'];

    // 2. Hämta ALLA bokningar för frisören inkl. deras behandlingars varaktighet
    $stmt = $conn->prepare("
        SELECT b.datum, b.tid, bh.varaktighet 
        FROM bokningar b
        JOIN behandling bh ON b.behandling_id = bh.id
        WHERE b.frisor_id = ? AND b.datum BETWEEN ? AND ? AND b.status = 'bokad'
    ");
    $stmt->bind_param("iss", $frisor_id, $start, $slut);
    $stmt->execute();
    $result = $stmt->get_result();

    // 3. Skapa en lista över ALLA upptagna tidsintervall
    $upptagnaTider = []; // Ex: ['2025-04-18-15:30', '2025-04-18-16:00', ...]
    while ($row = $result->fetch_assoc()) {
        $datum = $row['datum'];
        $startTid = new DateTime($datum . ' ' . $row['tid']);
        $varaktighet = (int)$row['varaktighet'];

        $slutTid = clone $startTid;
        $slutTid->modify("+$varaktighet minutes");

        // Lägg till alla 30-minutersintervaller inom denna bokning
        for ($tid = clone $startTid; $tid < $slutTid; $tid->modify('+30 minutes')) {
            $nyckel = $tid->format('Y-m-d-H:i');
            $upptagnaTider[$nyckel] = true;
        }
    }

    // 4. Generera lediga tider
    $ledigaTider = [];
    $startDate = new DateTime($start);
    $endDate = new DateTime($slut);

    for ($datum = clone $startDate; $datum <= $endDate; $datum->modify('+1 day')) {
        $dag = $datum->format("Y-m-d");
        $tider = [];

        for ($h = 9; $h <= 17; $h++) {
            for ($m = 0; $m < 60; $m += 30) {
                $startTid = new DateTime($dag . sprintf(' %02d:%02d', $h, $m));
                $slutTid = clone $startTid;
                $slutTid->modify("+$valdVaraktighet minutes");

                // Kontrollera om sluttiden går över 18:00
                if ((int)$slutTid->format('H') > 18 || $slutTid->format('H:i') > '18:00') {
                    continue;
                }

                // Kolla om någon del av det föreslagna intervallet är upptagen
                $konflikt = false;
                for ($tid = clone $startTid; $tid < $slutTid; $tid->modify('+30 minutes')) {
                    $nyckel = $tid->format('Y-m-d-H:i');
                    if (isset($upptagnaTider[$nyckel])) {
                        $konflikt = true;
                        break;
                    }
                }

                if (!$konflikt) {
                    $tider[] = $startTid->format("H:i");
                }
            }
        }

        if (!empty($tider)) {
            $ledigaTider[] = [
                "date" => $dag,
                "times" => $tider
            ];
        }
    }

    echo json_encode($ledigaTider);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Fel: " . $e->getMessage()]);
}
