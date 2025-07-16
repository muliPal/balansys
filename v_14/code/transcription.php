<!DOCTYPE html>
<html>
    <head>
        <title>Transcription</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="transcription.css">
        <link rel="stylesheet" href="../../../outlook/v/zone/zone.css">
    </head>
    <script type="module">
        //
        import {transcription} from './transcription.js';
        //
        window.onload = async () => {
            //
            //Create the class to support the transcription work
            const page = new transcription();
            //
            //Complete the construction of a page
            await page.init();
            //
            //Paint the page with an initial layout
            await page.show();
        };
    </script>

    <body>
        <div id="consumer">consumer</div>
        <div id="file">file</div>
        <div id="image">image</div>
        <div id="receipt">receipt</div>
        <div id="supplier">supplier</div>
        <div id="purchase">purchase</div>

    </body>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll("#consumer, #file, #image, #receipt, #supplier, #purchase")
                    .forEach(cell => {
                        cell.classList.add("grid-cell");

                        cell.addEventListener("click", function () {
                            document.querySelectorAll(".grid-cell").forEach(c => c.classList.remove("active"));
                            this.classList.add("active");
                        });
                    });
        });

    </script>

</html>
