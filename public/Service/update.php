<?php
include 'db.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // $itemname = $_POST['itemname'];
    $amount = $_POST['amount'];
    $userid = $_POST['userid'];
    $id = $_POST['id'];

    // Check if all required POST parameters are set
    if (isset($userid, $amount, $id)) {
        $stmt = $db->prepare("UPDATE items SET amount = ? WHERE userid = ? AND id = ?");
        $stmt->bind_param("isi", $amount, $userid, $id);
        if($stmt->execute()){
            echo json_encode(['success' => true, 'message' => 'Successfully changed']);
        }
        else{
            echo json_encode(['success' => false, 'message' => 'Update Failed']);
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
