<?php
// Initialize the session.
session_start();
// Unset all of the session variables.
unset($_SESSION['name'], $_SESSION['id']);
// Finally, destroy the session.    
session_destroy();

// Include URL for Login page to login again.
header("Location: ../home.html");
exit;
?>