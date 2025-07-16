<?php
// Files.php

// Set the content type to application/json
header('Content-Type: application/json');

// Database credentials
$host = 'localhost';
$dbname = 'balansys_1';
$username = 'root';
$password = '';

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the query
    $stmt = $pdo->query("SELECT * FROM image LIMIT 10");

    // Fetch the results as an associative array
    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if files were found
    if (empty($files)) {
        echo json_encode(["message" => "No files found"]);
    } else {
        // Output the data as JSON
        echo json_encode($files);
    }
} catch (PDOException $e) {
    // Return error message in JSON format
    echo json_encode(["error" => $e->getMessage()]);
}
