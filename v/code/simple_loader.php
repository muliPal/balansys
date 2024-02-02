<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");
//
//
$layout = [
    //
    //Recipt infomation 
    ["2023-06-30", "receipt", "date"],
    ['1', "receipt", "invoice"],
    ['p.muraya', "receipt", "source"],
    //
    //The supplier infomation
    ['chickjoint', "business", "title", ["supplier"]],
    ['chic', "business", "name", ["supplier"]],
    [null, "supplier", "supplier" ,["supplier"]],
    //
    //The consumer infomation
    ['Mutall Investment Company', "business", "title", ["consumer"]],
    ['Mutall', "business", "name", ["consumer"]],
    [null, "consumer", "consumer", ["consumer"]],
    //
    //Qty
    [1, "qty", "value"],
    //
    //Item  
    ['kg', "item", "unit"],
    ['beef fry', "item", "name"],
    ['kshs', "item", "currency"],
    [800, "item", "price"],
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;
