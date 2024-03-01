<html>
    <body>

        <h1>My name is simon</h1>
        <?php
          
//            //Show the whole second row 
//            echo 'code=';
//            echo $_POST['code'][1];
//            echo ',';
//            echo 'name=';    
//            echo $_POST['name'][1];
//            echo ',';
//            echo 'unit=';    
//            echo $_POST['unit'][1];
//            echo ',';
//            echo 'value=';    
//            echo $_POST['value'][1];
//            echo ',';
//            echo 'price=';    
//            echo $_POST['price'][1];
//            echo ',';
//            echo 'amount=';    
//            echo $_POST['amount'][1];
      //  print the total column
       echo "<pre>".json_encode($_POST, JSON_PRETTY_PRINT)."</pre>";
              
       //  echo $_POST['amount'][0]+ $_POST['amount'][1]+ $_POST['amount'][2];
//            echo ',';
//          
//            echo $_POST['amount'][1];
//             echo ',';
//              
//            echo $_POST['amount'][2];
//             echo ',';
//          
//            echo $_POST['amount'][3];
//             echo ',';
//            
//            echo $_POST['amount'][4];
//             echo ',';
//            
//            echo $_POST['amount'][5];
//             echo ',';
//             
//            echo $_POST['amount'][6];
//             echo ',';
//            
//            echo $_POST['amount'][7];
//             echo ',';
//              
//            echo $_POST['amount'][8];
//             echo ',';
//             
//            echo $_POST['amount'][9];
            
//              // here i used chat gpt to help me calculate the sum of the amounts
//            // Your existing code to display amounts
//            for ($i = 0; $i < 10; $i++) {
//                
//                echo "amount=".$_POST['amount'][$i].", ";
//                
//            }

       
//            // Calculate and display the sum
//            $sum = 0;
//            for ($i = 0; $i < 10; $i++) {
//            echo "sum=". $sum+ $_POST["amount"][$i];echo "<br/>";
//                   
//             echo  "value=". $_POST["amount"][$i];                
//               
//            }

//          echo 'Sum of amounts: ' . $sum;
////        
////         // Calculate and display the value and price for row 3
//            $row3Value = isset($_POST['unit'][2]) && isset($_POST['price'][2]) ? floatval($_POST['unit'][2]) * floatval($_POST['price'][2]) : 0;
//            echo '<br>';
//            echo 'Value on Row 3: ' . $row3Value;
//
//            $row3Price = isset($_POST['unit'][2]) ? floatval($_POST['unit'][2]) : 0;
//
//            echo '<br>';
//            echo 'Price on Row 3: ' . $row3Price;
//       