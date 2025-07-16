// Variable to track the current image index
let currentIndex = 0;

// Array to store the file URLs
const files = [
    "http://localhost/balansys/images/BMJ_shop/CamScanner 09-28-2023 15.50_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0001.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0003.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0004.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_22 14_53 bmn_page-0005.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0001.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0002.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0003.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0004.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0005.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0006.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0007.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0008.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0009.jpg",
    "http://localhost/balansys/images/BMJ_shop/2024jan-feb/2024_02_27 14_19 bmj_page-0010.jpg"
];

// Function to display the list of files
function displayFiles() {
    const fileSection = document.getElementById("file");
    const orderedList = document.createElement("ol");

    files.forEach((file, index) => {
        const listItem = document.createElement("li");
        const fileLink = document.createElement("a");
        fileLink.href = "#";
        fileLink.textContent = file.replace("http://localhost/balansys/images/", "");

        fileLink.addEventListener("click", function (event) {
            event.preventDefault();
            const imageSection = document.getElementById("image");
            const imgElement = document.createElement("img");
            imgElement.src = file;
            imgElement.alt = "Selected Image";
            imageSection.innerHTML = "";
            imageSection.appendChild(imgElement);
            currentIndex = index;
        });

        listItem.appendChild(fileLink);
        orderedList.appendChild(listItem);
    });

    fileSection.appendChild(orderedList);
}

// Function to display the selected image
function displayImage(imageSrc) {
    const imageSection = document.getElementById("image");
    const imgElement = document.createElement("img");
    imgElement.src = imageSrc;
    imgElement.alt = "Selected Image";
    imageSection.innerHTML = "";
    imageSection.appendChild(imgElement);
}

// Function to add event listeners to existing navigation buttons
function createNavigationButtons() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    if (!prevButton || !nextButton) {
        console.error("Navigation buttons not found.");
        return;
    }

    prevButton.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            displayImage(files[currentIndex]);
        }
    });

    nextButton.addEventListener("click", function () {
        if (currentIndex < files.length - 1) {
            currentIndex++;
            displayImage(files[currentIndex]);
        }
    });
}

// Function to display the receipt form
function displayReceiptDetails() {
    const receiptSection = document.getElementById("receipt");
    const fieldset = document.createElement("fieldset");

    const legend = document.createElement("legend");
    legend.textContent = "Invoice";

    const dateInput = document.createElement("input");
    dateInput.type = "date";

    const invoiceNoInput = document.createElement("input");
    invoiceNoInput.type = "text";

    const supplierInput = document.createElement("input");
    supplierInput.type = "text";

    const consumerInput = document.createElement("input");
    consumerInput.type = "text";

    const kraInput = document.createElement("input");
    kraInput.type = "text";

    fieldset.appendChild(legend);
    fieldset.appendChild(document.createTextNode("Date:"));
    fieldset.appendChild(dateInput);
    fieldset.appendChild(document.createElement("br"));
    fieldset.appendChild(document.createTextNode("Invoice no:"));
    fieldset.appendChild(invoiceNoInput);
    fieldset.appendChild(document.createElement("br"));
    fieldset.appendChild(document.createTextNode("Supplier:"));
    fieldset.appendChild(supplierInput);
    fieldset.appendChild(document.createElement("br"));
    fieldset.appendChild(document.createTextNode("Consumer:"));
    fieldset.appendChild(consumerInput);
    fieldset.appendChild(document.createElement("br"));
    fieldset.appendChild(document.createTextNode("K.R.A:"));
    fieldset.appendChild(kraInput);
    fieldset.appendChild(document.createElement("br"));

    receiptSection.appendChild(fieldset);
}

// Main function to initialize the page
export function initializePage() {
    displayFiles(); // Display the list of files
    createNavigationButtons(); // Set up navigation buttons
    displayReceiptDetails(); // Display the receipt details form
}
