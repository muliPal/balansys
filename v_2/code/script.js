// Data for the table
const tableData = [
    ["Image", "Name", "Age", "Country"], // Header row
    ["http://localhost/balansys/images/BMJ_shop/CamScanner%2008-31-2023%2011.59_page-0001.jpg", "John Doe", "25", "USA"], // First row with the image path
    ["D:/mutall_projects/balansys/images/BMJ_shop/CamScanner 08-31-2023 11.59_page-0001.jpg", "Jane Smith", "30", "Canada"], // Second row
    ["D:/mutall_projects/balansys/images/BMJ_shop/CamScanner 08-31-2023 11.59_page-0001.jpg", "Wang Wei", "28", "China"] // Third row
];
// Function to create a table
function createTable(data) {
    const table = document.createElement('table');
    table.border = "1";  // Add border to the table

    // Loop through the rows of data
    for (let row of data) {
        const tr = document.createElement('tr');
        // Loop through the cells in the row
        for (let i = 0; i < row.length; i++) {
            const td = document.createElement(data.indexOf(row) === 0 ? 'th' : 'td');  // 'th' for headers, 'td' for normal cells

            if (i === 0 && data.indexOf(row) !== 0) {
                // Create an image element for the first cell of non-header rows
                const img = document.createElement('img');
                img.src = row[i]; // Set the image source from data
                img.alt = "Image"; // Add alt text for the image
                img.width = 50;  // Set width (you can adjust)
                img.height = 50; // Set height (you can adjust)
                td.appendChild(img); // Add the image to the first cell (td)
            } else {
                // Otherwise, just add text content to the cell
                td.textContent = row[i];
            }

            tr.appendChild(td); // Append the cell to the row
        }

        table.appendChild(tr); // Append the row to the table
    }

    return table;
}

// Get the table container div
const tableContainer = document.getElementById('table-container');

// Create the table and append it to the container
const table = createTable(tableData);
tableContainer.appendChild(table);
