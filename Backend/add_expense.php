<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $amount = $_POST['amount'];
    $user_id = $_POST['user_id']; // Get user ID from request

    $sql = "INSERT INTO expenses (name, category, amount, user_id) VALUES ('$name', '$category', $amount, $user_id)";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Expense added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
}
?>
