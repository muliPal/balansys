<?php
// Increase memory limit if necessary
ini_set('memory_limit', '512M'); // Adjust as needed

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "balansys";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to retrieve up to 5 images from the database
$sql = "SELECT CONCAT(folder.name, '/', image.name) AS image_name, image.name AS image_picture
        FROM image
        LEFT JOIN folder ON image.folder = folder.folder
        LIMIT 5"; // Limit to 5 images
$result = $conn->query($sql);

// Close the connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Image Gallery</title>
        <style>
            table {
                width: 60%;
                border: 1px solid black;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
            }
            img {
                width: 50px; /* Adjust size as needed */
                height: auto;
            }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <th>Image</th> <!-- Display the actual image -->
                <th>Image Name</th>
                <th>Folder + Image Name</th>
            </tr>
            <?php
            // Output each image as a row in the table
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo '<tr>';
                    // First column: image from the localhost path
                    echo '<td><img src="http://localhost/balansys/images/BMJ_shop/' . htmlspecialchars($row['image_picture']) . '" alt="' . htmlspecialchars($row['image_name']) . '" /></td>';
                    // Second column: image name
                    echo '<td>' . htmlspecialchars($row['image_name']) . '</td>';
                    // Third column: folder name + image name
                    echo '<td>' . htmlspecialchars($row['image_name']) . '</td>';
                    echo '</tr>';
                }
            } else {
                echo '<tr><td colspan="3">No images found</td></tr>';
            }
            ?>
        </table>

        <!-- File input for displaying selected image -->
        <div>
            <input type="file" id="imageInput" accept="image/*">
            <img id="displayImage" alt="Selected Image" style="display:none; width:300px;">
            <p id="fileName"></p>
        </div>

        <script>
            // File input handling
            const imageInput = document.getElementById('imageInput');
            const displayImage = document.getElementById('displayImage');
            const fileName = document.getElementById('fileName');

            imageInput.addEventListener('change', function () {
                const file = this.files[0]; // Get the selected file

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        displayImage.src = e.target.result; // Set the image src to the file data
                        displayImage.style.display = 'block'; // Display the image
                        fileName.textContent = `File Name: ${file.name}`; // Display the file name
                    };

                    reader.readAsDataURL(file); // Read the file as a data URL
                }
            });
        </script>
    </body>
</html>
