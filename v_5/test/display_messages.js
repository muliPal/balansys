export function messages() {
    const sections = [
        {id: "file", message: "Displaying Files"},
        {id: "button", message: "Navigate"},
        {id: "image", message: "Image Section"},
        {id: "receipt", message: "Receipt Information"},
        {id: "purchase", message: "Purchase Details"}
    ];

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            element.textContent = section.message;
        }
    });
}
