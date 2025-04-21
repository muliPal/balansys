<!DOCTYPE html>
<html>
    <head>
        <title>Transcription</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="transcription.css">
        <link rel="stylesheet" href="../../../outlook/v/zone/zone.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
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
            //
            //Expose the page so we can use it in the HTML
            window.page = page;
        };
    </script>
    <body>
        <!--<button onclick='page.login()'>Login</buton>-->
        <div id="consumer">consumer</div>
        <div id="file">file</div>
        <div id="image">image</div>
        <div id="receipt">receipt</div>
        <div id="nav">
            <div id="panner">
                <button onclick="page.pan(-10, 0)">&#11160;</button>
                <button onclick="page.pan(10, 0)">&#11162;</button>
                <button onclick="page.pan(0, -10)">&#11161;</button>
                <button onclick="page.pan(0, 10)">&#11163;</button>
            </div>
            <button class="rotate" onclick="page.rotate(true)"><i class="fa fa-sync"></i> Rotate</button>
            <button class="zoom-in" onclick="page.zoom_in(true)"><i class="fa fa-search-plus"></i> Zoom In</button>
            <button class="zoom-out" onclick="page.zoom_in(false)"><i class="fa fa-search-minus"></i> Zoom Out</button>
           
        </div>
        <div id="supplier">supplier</div>
        <div id="purchase">purchase</div>

    </body>
</html>
