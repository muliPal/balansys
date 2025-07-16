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
            NULL AS `match`,
            CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS path,
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
        //
        // Return the image data
        return $row;
    } else {
        $db->close();
        //
        // Return null if no image found
        return null;
    }
}

//
// Get the first image data
$firstImage = getFirstImage($servername, $username, $password, $dbname);
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="validator.css">
        <title>Display First Image</title>
    </head>
    <body>
        <h1>First Image from Database</h1>
        <table border="1">
            <tr>
                <th>Actual Image</th>
                <th>Image Picture</th>
                <th>Match</th>
                <th>Folder Name + Image Name</th>
                <th>Comment</th>
            </tr>
            <tr>
                <td>
                    <?php if ($firstImage): ?>
                        <img src="<?php echo htmlspecialchars($firstImage['image_name']); ?>" alt="First Image" style="width:100px;">
                    <?php else: ?>
                        No image found
                    <?php endif; ?>
                </td>
                <td>
                    <img src="<?php echo htmlspecialchars($firstImage['image_picture']); ?>" alt="Image Picture" style="width:100px;">
                </td>
                <td>
                    <input type="checkbox" name="match" value="1">
                </td>
                <td>
                    <?php echo htmlspecialchars($firstImage['path']); ?>
                </td>
                <td>
                    <input type="text" name="comment" placeholder="Add comment">
                </td>
            </tr>
        </table>
    </body>
</html>
