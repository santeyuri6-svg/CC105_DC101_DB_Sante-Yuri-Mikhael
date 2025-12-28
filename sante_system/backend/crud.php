<?php
header('Content-Type: application/json; charset=utf-8');
// Allow same-origin requests when testing locally (adjust for production)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db_caller.php';

$action = $_GET['action'] ?? null;
$mysqli = db_connect();

function respond($data){
    echo json_encode($data);
    exit;
}

if (!$action) {
    respond(['success'=>false,'error'=>'No action specified']);
}

// List all students (joins courses and sections)
if ($action === 'list') {
    $sql = "SELECT s.student_id, s.name, s.year_level, c.course_code, c.course_name, sec.section_name, s.course_id, s.section_id 
            FROM students s
            JOIN courses c ON s.course_id = c.course_id
            JOIN sections sec ON s.section_id = sec.section_id
            ORDER BY s.student_id ASC";
    $res = $mysqli->query($sql);
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    respond(['success'=>true,'data'=>$rows]);
}

// Get single student
if ($action === 'get') {
    $id = $_GET['id'] ?? '';
    $stmt = $mysqli->prepare("SELECT student_id, name, year_level, course_id, section_id FROM students WHERE student_id = ?");
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    respond(['success'=>true,'data'=>$row]);
}

// Create student
if ($action === 'create') {
    $body = json_decode(file_get_contents('php://input'), true);
    $student_id = $body['student_id'] ?? '';
    $name = $body['name'] ?? '';
    $course_id = intval($body['course_id'] ?? 0);
    $year_level = intval($body['year_level'] ?? 0);
    $section_id = intval($body['section_id'] ?? 0);

    $stmt = $mysqli->prepare("INSERT INTO students (student_id, name, course_id, year_level, section_id) VALUES (?, ?, ?, ?, ?)"); 
    $stmt->bind_param('ssiii', $student_id, $name, $course_id, $year_level, $section_id);
    if ($stmt->execute()) {
        respond(['success'=>true,'message'=>'Student created']);
    } else {
        respond(['success'=>false,'error'=>$stmt->error]);
    }
}

// Update student
if ($action === 'update') {
    $body = json_decode(file_get_contents('php://input'), true);
    $student_id = $body['student_id'] ?? '';
    $name = $body['name'] ?? '';
    $course_id = intval($body['course_id'] ?? 0);
    $year_level = intval($body['year_level'] ?? 0);
    $section_id = intval($body['section_id'] ?? 0);

    $stmt = $mysqli->prepare("UPDATE students SET name=?, course_id=?, year_level=?, section_id=? WHERE student_id=?");
    $stmt->bind_param('siiis', $name, $course_id, $year_level, $section_id, $student_id);
    if ($stmt->execute()) {
        respond(['success'=>true,'message'=>'Student updated']);
    } else {
        respond(['success'=>false,'error'=>$stmt->error]);
    }
}

// Delete student
if ($action === 'delete') {
    $id = $_GET['id'] ?? '';
    $stmt = $mysqli->prepare("DELETE FROM students WHERE student_id = ?");
    $stmt->bind_param('s', $id);
    if ($stmt->execute()) {
        respond(['success'=>true,'message'=>'Student deleted']);
    } else {
        respond(['success'=>false,'error'=>$stmt->error]);
    }
}

respond(['success'=>false,'error'=>'Unknown action']);
?>