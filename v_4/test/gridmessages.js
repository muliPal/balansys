export function displayMessages() {
    // Messages to be displayed in each section
    //remove this section and add the mesages directly
//    const messages = {
//        file: ,
//        image: "This is where the image will appear.",
//        receipt: "Receipt details will be displayed here.",
//        purchase: "Purchase information goes here."
//    };

    // Display messages in the respective grid sections
    document.getElementById("file").textContent = "This is the file section.".file;
    document.getElementById("image").textContent = "This is where the image will appear.".image;
    document.getElementById("receipt").textContent = "Receipt details will be displayed here.".receipt;
    document.getElementById("purchase").textContent = "Purchase information goes here.".purchase;
}