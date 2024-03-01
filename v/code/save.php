<?php
    $input = $_POST;
?>
<html>
    <body>
        <h1>Saving Receipt Data</h1>
        <?php
            //Show the raw inputs
            echo "<pre>".json_encode($input, JSON_PRETTY_PRINT)."</pre>";
            //
            //Get all the keys in the input
             $keys = array_keys($input);
            echo "<pre>".json_encode($keys, JSON_PRETTY_PRINT)."</pre>";
            //
            //Separate the page from header keys
            //
            //Get the page  keys
            $page = array_splice($keys, 0,5);
            echo "<pre>".json_encode($page, JSON_PRETTY_PRINT)."</pre>";
            //
            //Get the header keys
            $header = $keys;
            echo "<pre>".json_encode($header, JSON_PRETTY_PRINT)."</pre>";
            //
            //Count the nunumbe of rows in one of the header columns, e.g., code
            $rows = count($input['code']);
            echo 'No of rows = '. $rows.'<br/>';
            //
            //Count the number of columns
            $cols = count($header);
            echo 'No of cols = '. $cols.'<br/>';
            //
            //Define an array output
            $output = [];
            //
            //Output a 6 by 10 table of stars
            for($r=0; $r<$rows; $r++){
               //
                foreach($header as $h=>$k){
                    
                    //echo $input[$k][$r].", ";
                    $output[$r][$h] = $input[$k][$r];
                }
                //echo "<br/>";
            }
            echo "<pre>".json_encode($output, JSON_PRETTY_PRINT)."</pre>";
            
            
        ?>    
    </body>
</html>    