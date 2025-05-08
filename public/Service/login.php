<?php
include 'db.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // {"success":true,"name":"sap","id":21}
    $stmt = $db->prepare("SELECT * FROM users WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if ($password === $row['password']) {
            echo json_encode(['success' => true, 'name' => $row['name'], 'id' => $row['id']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid Password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid Username']);
    }

    $stmt->close();
    $db->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
