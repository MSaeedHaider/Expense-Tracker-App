<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include 'db.php';

$user_id = $_GET['user_id']; // Get user ID from query params

$sql = "SELECT * FROM expenses WHERE user_id = $user_id ORDER BY created_at DESC";
$result = $conn->query($sql);

$expenses = [];
while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}

echo json_encode($expenses);
?>
