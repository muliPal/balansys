<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "balansys";
//
// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);
//
// Prepare the SQL query to retrieve the BLOB image from the 'image' table
$sql = "SELECT picture FROM image WHERE image = ?";
$imageId = 91;
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $imageId);
$stmt->execute();
$stmt->bind_result($picture);

if ($stmt->fetch()) {
    //
    // Set the correct Content-Type for the HTTP response
    header("Content-Type: image/jpeg");
    //
    // Output the BLOB data
    echo $picture;
} else {
    echo "Image not found";
}
//
//Close the conection
$stmt->close();
$conn->close();

