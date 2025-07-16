<?php
// The mutall PHP code is accessed from the mutall namespace

namespace mutall;

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "balansys";

//
// Function to get the first image from the database
function getFirstImage($servername, $username, $password, $dbname) {
    //
    // Connect to the database
    $db = new \mysqli($servername, $username, $password, $dbname);
    //
    // Check connection
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }
    //
    // SQL query to get the first image
    $query = "
        SELECT
            CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS image_name,
            image.picture AS image_picture,
            CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS path,
            NULL AS `match`,
            NULL AS comment
        FROM
             image
        LEFT JOIN folder ON image.folder = folder.folder
        LIMIT 1;
    ";

    $result = $db->query($query);
    //
    // Fetch the first image URL
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $db->close();
        echo '<pre>' . json_encode($row) . ' </pre>';
        //
        // Return the image URL
        return $row['image_name'];
    } else {
        $db->close();
        //
        // Return null if no image found
        return null;
    }
}

//
// Get the first image URL
$firstImageUrl = getFirstImage($servername, $username, $password, $dbname);
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Display First Image</title>
    </head>
    <body>
        <h1>First Image from Database</h1>
        <!-- Image element to display the first image -->
        <?php if ($firstImageUrl): ?>
            <img id="first-image" src="<?php echo htmlspecialchars($firstImageUrl); ?>" alt="First Image" style="width:300px;">
        <?php else: ?>
            <p>No images found in the database.</p>
        <?php endif; ?>

        <script>
            window.onload = () => {
                const imageElement = document.getElementById('first-image');
                // Optionally handle any JavaScript actions if needed
                console.log(`${<?php echo htmlspecialchars($firstImageUrl); ?>}`);
            };
        </script>
    </body>
</html>
