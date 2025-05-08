<?php
include 'db.php';

// function checkDuplicate($db, $column, $value) {
//     $stmt = $db->prepare("SELECT $column FROM users WHERE $column = ?");
//     $stmt->bind_param("s", $value);
//     $stmt->execute();
//     $stmt->store_result();
//     $duplicate = $stmt->num_rows > 0;
//     $stmt->close();
//     return $duplicate;
// }

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    // $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $db->prepare("SELECT * FROM users WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 0){
        //$sql = "INSERT INTO users (name, password) VALUES ('$name', '$password')";
        $sql = $db->prepare("INSERT INTO users (name, password) VALUES (?,?)");
        $sql->bind_param("ss", $name, $password);
        
        if ($sql->execute()) {
            echo json_encode(['success' => true]);
            //header("location: /Javascript/Project/registry.html");
        } else {
            echo json_encode(['success' => false, 'message' => 'Error creating account']);
            //echo "Error inserting data: " . $db->error;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
    }

    


    // if (checkDuplicate($db, 'email', $email)) {
    //     echo "Email already registered. Please use a different email.";
    // } 
    // else 
    // if (checkDuplicate($db, 'name', $name)) {
    //     echo "Name already registered. Please use a different name.";
    // }
    // else {
    //     // Insert new user
    //     // $stmt = $db->prepare("INSERT INTO users (name, password) VALUES (?, ?)");
    //     // $stmt->bind_param("ss", $name, $password);
    //     // $stmt->execute();
        
        
    //     // Redirect to the registry.html page
        
    // }

    // $stmt->close();
    // $db->close();
}
else{
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>