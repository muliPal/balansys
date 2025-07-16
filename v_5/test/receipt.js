//on this exercise, i intend to add the receipt section
//
// Array of file paths (using localhost as prefix)
const files = [
    "http://localhost/balansys/images/BMJ_shop/CamScanner%2009-28-2023%2015.50_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22%2014_53%20bmn_page-0001.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22%2014_53%20bmn_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22%2014_53%20bmn_page-0003.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22%2014_53%20bmn_page-0004.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22%2014_53%20bmn_page-0005.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27%2014_19%20bmj_page-0001.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27%2014_19%20bmj_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27%2014_19%20bmj_page-0003.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27%2014_19%20bmj_page-0004.jpg",
            // Add other paths similarly...
];

let currentIndex = 0; // Track the current image index

// Function to display files as links and show images upon clicking each link
function displayFiles() {
    const fileSection = document.getElementById("file");
    const imageSection = document.getElementById("image");

    fileSection.innerHTML = '';
    const orderedList = document.createElement("ol");
    fileSection.appendChild(orderedList);

    // Create the image element in the image section
    const imgElement = document.createElement("img");
    imgElement.style.maxWidth = "100%";
    imgElement.alt = "Selected Image";
    imageSection.appendChild(imgElement);

    // Initialize the displayed image
    imgElement.src = files[currentIndex];

    files.forEach((filePath, index) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        // Set link href to the active path
        link.href = "#";  // Set as "#" to prevent default navigation
        link.textContent = filePath.split("/").pop(); // Show only the file name

        listItem.appendChild(link);
        orderedList.appendChild(listItem);

        // Display the image when each link is clicked
        link.addEventListener("click", (event) => {
            event.preventDefault();
            currentIndex = index; // Update current index to the clicked image
            imgElement.src = filePath; // Set the src attribute of the img element to show the image
        });
    });
}

// Function to handle Next and Prev button clicks
function navigate(direction) {
    const imgElement = document.querySelector("#image img");

    // Update the index based on direction
    if (direction === "next") {
        currentIndex = (currentIndex + 1) % files.length;
    } else if (direction === "prev") {
        currentIndex = (currentIndex - 1 + files.length) % files.length;
    }

    // Update the image source
    imgElement.src = files[currentIndex];
}

// Function to display the navigation buttons with event listeners
function setupNavigationButtons() {
    const buttonSection = document.getElementById("button");

    // Create Next and Prev buttons
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.addEventListener("click", () => navigate("prev"));

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => navigate("next"));

    // Append buttons to the button section
    buttonSection.appendChild(prevButton);
    buttonSection.appendChild(nextButton);
}

// Function to display the fieldset for receipt details
function displayReceipt() {
    const receiptSection = document.getElementById("receipt");

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Invoice";

    fieldset.appendChild(legend);

    const labels = ["Date:", "Invoice no:", "Supplier:", "Consumer:", "K.R.A"];
    const types = ["date", "text", "text", "text", "text"];

    labels.forEach((labelText, index) => {
        const label = document.createElement("label");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = types[index];

        fieldset.appendChild(label);
        fieldset.appendChild(input);
        fieldset.appendChild(document.createElement("br"));
    });

    receiptSection.appendChild(fieldset);
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
        if (element && section.id !== "file") {
            element.textContent = section.message;
        }
    });
}

// Function to initialize all components
export function initializePage() {
    displayMessages();
    displayFiles();
    setupNavigationButtons();
    displayReceipt();
}
