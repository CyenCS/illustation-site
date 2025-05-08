<?php
include 'db.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $itemname = $_POST['itemname'];
    $amount = $_POST['amount'];
    $userid = $_POST['userid'];

    // Check if all required POST parameters are set
    if (isset($itemname, $amount, $userid)) {
        $stmt = $db->prepare("SELECT * FROM items WHERE itemname = ? AND userid = ?");
        $stmt->bind_param("si", $itemname, $userid);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            $stmt2 = $db->prepare("INSERT INTO items (itemname, amount, userid) VALUES (?, ?, ?)");
            $stmt2->bind_param("sii", $itemname, $amount, $userid);

            if($stmt2->execute()){
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Insert Failed']);
            }
            $stmt2->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Item already exists']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    }
    $db->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
