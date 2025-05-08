<?php
include 'db.php';
header('Content-Type: application/json');

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $keyword = isset($_POST['keyword']) ? $_POST['keyword'] : ''; 
        $userid = isset($_POST['userid']) ? $_POST['userid'] : ''; 

        if (empty($userid)) {
            throw new Exception('No userID input');
        }

        $query = "SELECT * FROM items WHERE userid = ?";

        if (!empty($keyword)) {
            $keyword = "{$keyword}%"; // Add wildcards for LIKE search
            $query .= " AND itemname LIKE ?";
        }

        $stmt = $db->prepare($query);

        if (!empty($keyword)) {
            $stmt->bind_param("is", $userid, $keyword);
        } else {
            $stmt->bind_param("i", $userid);
        }

        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $db->error);
        }

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(['success' => true, 'data' => $data]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No search results found']);
        }

        $stmt->close();
    } else {
        throw new Exception('Wrong request method');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$db->close();
