// Variable to track the current image index
let currentIndex = 0;
//
// Function to display the list of files
function displayFiles() {
    //
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
    //
    // Get the 'file' section to display the list
    const fileSection = document.getElementById("file");
    //
    // Create an ordered list to hold the file links
    const orderedList = document.createElement("ol");
    //
    // Loop through the files array and create list items for each file
    files.forEach((file, index) => {
        //
        // Create a list item for each file
        const listItem = document.createElement("li");
        //
        // Create a link for the file
        const fileLink = document.createElement("a");
        //
        // Prevent default behavior (opening in new tab)
        fileLink.href = "#";
        fileLink.textContent = file.replace("http://localhost/balansys/images/", ""); // Set the link text to the file name
        //
        // Add click event listener to display the image when clicked
        fileLink.addEventListener("click", function (event) {
            //
            // Prevent default link action
            event.preventDefault();
            //
            // Get the image section to display the selected image
            const imageSection = document.getElementById("image");
            //
            // Create an img element
            const imgElement = document.createElement("img");
            //
            // Set the image src to the clicked file's path
            imgElement.src = file;
            //
            // Set alt text for the image
            imgElement.alt = "Selected Image";
            //
            // Clear previous images and append the new one
            imageSection.innerHTML = "";
            //
            // Append the new image
            imageSection.appendChild(imgElement);
            //
            // Update the current index when an image is clicked
            // Update the current image index
            currentIndex = index;
        });
        //
        // Append the file link to the list item
        listItem.appendChild(fileLink);
        //
        // Append the list item to the ordered list
        orderedList.appendChild(listItem);
    });

    // Append the ordered list to the file section
    fileSection.appendChild(orderedList);
}

// Function to display the selected image
function displayImage(imageSrc) {
    // Get the image section
    const imageSection = document.getElementById("image");

    // Create an img element
    const imgElement = document.createElement("img");
    imgElement.src = imageSrc; // Set the image source
    imgElement.alt = "Selected Image"; // Set alt text for the image

    // Clear previous images and append the new one
    imageSection.innerHTML = ""; // Clear previous image
    imageSection.appendChild(imgElement); // Append the new image to the section
}

// Function to create the navigation buttons and functionality
function createNavigationButtons() {
    //
    // Get the navigation section
    const navSection = document.getElementById("navigate");
    //
    // Create "Prev" Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev"; // Set button text to "Prev"

    // Add click event for going to the previous image
    prevButton.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--; // Decrease the current index
            displayImage(files[currentIndex]); // Display the previous image
        }
    });
    //
    // Create "Next" Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next"; // Set button text to "Next"

    // Add click event for going to the next image
    nextButton.addEventListener("click", function () {
        if (currentIndex < files.length - 1) {
            currentIndex++; // Increase the current index
            displayImage(files[currentIndex]); // Display the next image
        }
    });

    // Append buttons to the navigation section
    navSection.appendChild(prevButton);
    navSection.appendChild(nextButton);
}

// Function to display the receipt form
function displayReceiptDetails() {
    //
    // Get the receipt section
    const receiptSection = document.getElementById("receipt");

    // Create a fieldset for the receipt form
    const fieldset = document.createElement("fieldset");

    // Create a legend for the receipt form
    const legend = document.createElement("legend");
    legend.textContent = "Invoice"; // Set the legend text to "Invoice"

    // Create the input fields for the receipt form
    const dateInput = document.createElement("input");
    dateInput.type = "date"; // Set the input type to date

    const invoiceNoInput = document.createElement("input");
    invoiceNoInput.type = "text"; // Set the input type to text

    const supplierInput = document.createElement("input");
    supplierInput.type = "text"; // Set the input type to text

    const consumerInput = document.createElement("input");
    consumerInput.type = "text"; // Set the input type to text

    const kraInput = document.createElement("input");
    kraInput.type = "text"; // Set the input type to text

    // Append the input fields and legend to the fieldset
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
    //
    // Append the fieldset to the receipt section
    receiptSection.appendChild(fieldset);
}
