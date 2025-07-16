export async function displayFiles() {
    try {
        // Fetch the list of files from the backend (Files.php)
        const response = await fetch('Files.php');

        // Check if the response is okay (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the raw text of the response for debugging
        const text = await response.text();
        console.log('Response Text:', text); // Log the raw response

        // Check if the response is empty or invalid
        if (!text) {
            throw new Error('Received empty response');
        }

        // Now, try to parse it as JSON
        const files = JSON.parse(text);

        // Get the file section and create an ordered list
        const fileSection = document.getElementById("file");
        const ol = document.createElement("ol");

        // Add each file to the ordered list
        files.forEach(file => {
            const li = document.createElement("li");
            li.textContent = file.name; // Adjust based on the actual field name in your table
            ol.appendChild(li);
        });

        // Append the ordered list to the file section
        fileSection.appendChild(ol);
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}
