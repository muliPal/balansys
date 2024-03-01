<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");
//
$changes = [
    //
    //Recipt infomation 
    ['2024-01-15', "receipt", "date"],
    ['2024-01-15', "je", "date"],
    
    ['666', "receipt", "invoice"],
    ['666', "je", "ref"],
    ['kitchen purchase', "receipt", "description"],
    ['kitchen purchase', "je", "description"],
    ['420', "je", "amount"],
    
    ['destiny', "business", "name", ["supplier"]],
    ['420', 'receipt', 'amount'],
    
    //
    //image/ flder
    ['\kitchen\2024_jan-feb', 'folder', 'name'],
    ['2024_02_09 14_39 Office 1_page-0004.jpg', 'image', 'name'],
];
//
//Local name of our table
$tname = 'receipt';

//
//The column names of the above table
$cnames = ['qty', 'unit', 'description', 'price'];
//
$array = [
    [1 , 'trey', 'Eggs', 420],
    [1 , 'pc', 'bag', 20],
];

//
$receipt = new matrix(
    $tname,
    $cnames,
    $array
);

//Define thelooup function
$fn = '\mutall\capture\lookup';

//
$layout = [
    //
    //Add the cganges here
    ...$changes,
    //
    $receipt,
    //
    //
    ['mutall_kitchen', "receipt", "source"],
    //
    //The supplier infomation
    [null, "supplier", "supplier" ,["supplier"]],
    //
    //The consumer infomation
    ['kitchen', "business", "name", ["consumer"]],
    [null, "consumer", "consumer", ["consumer"]],
    //
    //Item  
    [[$fn, $tname, 'code'], "item", 'code'],
    [[$fn, $tname, 'qty'], "qty", "value"],
    [[$fn, $tname, 'unit'], "item", "unit"],
    [[$fn, $tname, 'description'], "item", "name"],
    [[$fn, $tname, 'price'], "item", "price"],
    //
    
];
//
//Load the data using the most common method
$result = $q -> load_common($layout, '/balansys/v/code/log.xml', '/balansys/v/code/error.html');
//
//print the q
echo $result;
