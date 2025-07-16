<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Display First Image</title>
        <style>
            table {
                width: 60%;
                height: 60%;
                border: 1px solid black;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid black;
                text-align: center; /* Center-align text */
            }
            img {
                width: 50%; /* Adjust width of the image */
                height: auto; /* Maintain aspect ratio */
            }
        </style>
        <script type="module">
            // Load the picture only after the window is loaded
            window.onload = async () => {
                try {
                    // Fetch the first image URL from the backend
                    const response = await fetch('http://localhost/balansys/getFirstImage.php'); // Adjust this path if necessary
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json(); // Assuming your PHP returns JSON
                    const firstImageUrl = data.image_name; // Adjust based on your JSON structure
                    console.log(data);
                    // Populate the table with the results
                    const table = document.querySelector('table'); // Select the table
                    const newRow = table.insertRow(); // Create a new row

                    // Create cells for the row
                    const imageCell = newRow.insertCell(0); // For image.name
                    const pictureCell = newRow.insertCell(1); // For image.picture (if needed)
                    const folderImageCell = newRow.insertCell(2); // For folder.name + image.name

                    // Create and append the image element to the imageCell
                    const imgElement = document.createElement('img'); // Create an image element
                    imgElement.src = firstImageUrl; // Set the image source
                    imgElement.alt = 'First Image'; // Set alt text
                    imageCell.appendChild(imgElement); // Append image to the first cell

                    // Fill in other cells as needed (for example, with placeholders)
                    pictureCell.innerText = "Picture Data"; // Placeholder for image.picture
                    folderImageCell.innerText = "Folder/Image Name"; // Placeholder for folder.name + image.name
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
        </script>
    </head>
    <body>
        <table>
            <tr>
                <th>image.name</th>
                <th>image.picture</th>
                <th>folder.name + image.name</th>
            </tr>
        </table>
    </body>
</html>
