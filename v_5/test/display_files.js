//Here i want to hardwire a list of empty links of images

function displayFiles() {
    const fileSection = document.getElementById("file");

    // Array of file paths
    const files = [
        "D:/mutall_projects/balansys/images/balansys (version 3).xlsb",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0001.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0002.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0003.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0004.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0005.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0001.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0002.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0003.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0004.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0005.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0006.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0007.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0008.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0009.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0010.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0011.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0012.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0013.jpg",
        "D:/mutall_projects/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0014.jpg"
    ];

    // Clear the file section
    fileSection.innerHTML = '';

    // Loop through each file path and create a link element
    files.forEach((filePath) => {
        const link = document.createElement("a");
        link.href = "#"; // Empty href
        link.textContent = filePath.split("/").pop(); // Display only the file name
        link.style.display = "block"; // Display each link on a new line
        fileSection.appendChild(link);
    });
}

function displayMessages() {
    const sections = [
        {id: "file", message: "Displaying Files"},
        {id: "button", message: "Navigate"},
        {id: "image", message: "Image Section"},
        {id: "receipt", message: "Receipt Information"},
        {id: "purchase", message: "Purchase Details"}
    ];

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && section.id !== "file") { // Avoid overwriting the file section
            element.textContent = section.message;
        }
    });
}

// Combined function to initialize the page
export function initializePage() {
    displayMessages(); // Display messages in each section
    displayFiles();    // Add empty links to the "file" section
}