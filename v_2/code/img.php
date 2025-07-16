<?php

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "balansys";

// Function to get images from the database
function getImages($servername, $username, $password, $dbname) {
    // Connect to the database
    $db = new \mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    // SQL query to get images
    $query = "
        SELECT
            CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS image_name,
            image.picture AS image_picture
        FROM
            image
        LEFT JOIN folder ON image.folder = folder.folder
        LIMIT 1;"; // Limiting to 1 image
    // Execute the query
    $result = $db->query($query);

    // Initialize an array to store images
    $images = [];

    // Fetch image rows
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $images[] = $row;
        }
    } else {
        // If no results, return an empty array
        return [];
    }

    // Close the connection
    $db->close();

    return $images;
}

// Get images from the database
$images = getImages($servername, $username, $password, $dbname);

// Return the image data as a JSON response for JavaScript
header('Content-Type: application/json');

// Check if $images is not null or empty, and return JSON-encoded data
echo json_encode($images);

