// Define and export the MessageDisplayer class
export class MessageDisplayer {
    // Properties to store references to the HTML elements where messages will be displayed.
    // Each property can either be an HTMLElement or null (if the element is not found in the DOM).
    fileElement;
    imageElement;
    receiptElement;
    purchaseElement;
    // Constructor method that runs when an instance of the class is created.
    constructor() {
        // Find and assign the HTML element with ID "file" to the fileElement property.
        // If the element is not found, fileElement will be null.
        this.fileElement = document.getElementById("file");
        // Find and assign the HTML element with ID "image" to the imageElement property.
        this.imageElement = document.getElementById("image");
        // Find and assign the HTML element with ID "receipt" to the receiptElement property.
        this.receiptElement = document.getElementById("receipt");
        // Find and assign the HTML element with ID "purchase" to the purchaseElement property.
        this.purchaseElement = document.getElementById("purchase");
    }
    // Method to display specific messages in each HTML element.
    displayMessages() {
        // Check if fileElement is not null, meaning the element was found in the DOM.
        if (this.fileElement !== null) {
            // Set the text content of the fileElement to a specific message.
            this.fileElement.textContent = "This is the file section.";
        }
        // Check if imageElement is not null, meaning the element was found in the DOM.
        if (this.imageElement !== null) {
            // Set the text content of the imageElement to a specific message.
            this.imageElement.textContent = "This is where the image will appear.";
        }
        // Check if receiptElement is not null, meaning the element was found in the DOM.
        if (this.receiptElement !== null) {
            // Set the text content of the receiptElement to a specific message.
            this.receiptElement.textContent = "Receipt details will be displayed here.";
        }
        // Check if purchaseElement is not null, meaning the element was found in the DOM.
        if (this.purchaseElement !== null) {
            // Set the text content of the purchaseElement to a specific message.
            this.purchaseElement.textContent = "Purchase information goes here.";
        }
    }
}
