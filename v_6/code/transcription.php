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
            //Paint the page with an initial layout
            await page.show();
        };
    </script>
    <body>
        <div id="file"></div>
        <div id="image"></div>
        <div id="receipt"></div>
        <div id="purchase"></div>
    </body>
</html>
