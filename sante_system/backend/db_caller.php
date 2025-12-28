<?php
require_once __DIR__ . '/db_store.php';

function db_connect(){
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode(['success'=>false,'error'=>'DB connection failed: ' . $mysqli->connect_error]);
        exit;
    }
    $mysqli->set_charset('utf8mb4');
    return $mysqli;
}
?>