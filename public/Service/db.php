<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

// Create connection
$db = new mysqli($servername, $username, $password, $dbname);

// Check connection
if(!$db){
    echo "Database Connection Failed";
}
?>
