<!DOCTYPE html>
<html>
    <head>
        <title>Transcription</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--
        The order of the syles is important-->
        <link rel="stylesheet" href="../../../outlook/v/zone/zone.css">
        <link rel="stylesheet" href="transcription.css">
        
    </head>
    <script type="module">
        //
        import {receipt} from './receipt.js';
        //
        window.onload = async () => {
            //
            //Create a page of the receipt class
            const page = new receipt();
            //
            //Display the receipt
            await page.show();
        };
    </script>
    <body>
        
    </body>
</html>
