<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_POST['userid'];
    $id = $_POST['id'];

    // Check if all required POST parameters are set
    if (isset($userid, $id)) {
        $stmt = $db->prepare("DELETE FROM items WHERE userid = ? AND id = ?");
        $stmt->bind_param("ii", $userid, $id);
        if($stmt->execute()){
            echo json_encode(['success' => true, 'message' => 'Successfully deleted']);
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