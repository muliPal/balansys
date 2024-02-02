<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");

$tname = 'receipt';

$table = new csv(
        //
        //The name of the text table    
        $tname,
        //
        //The filename that holds the (milk) data    
        'balansys.csv',
        //
        //The following default values match the output from a database
        //query
        //
        //The header colmumn names. If empty, it means the user wishes 
        //to use the default values
        [],
        //
        //Text used as the value separator
        ",",
        //
        //The row number, starting from 0, where column names are stored
        //A negative number means that file has no header     
        0,
        //
        //The row number, starting from 0, where the table's body starts.        
        1
);

$fn = '\mutall\capture\lookup';

// $exp = new lookup($tname, 'intern');
//
//Map data from a csv file to a the database
$layout = [
    $table,
    //
    //Recipt infomation 
    [[$fn, $tname, 'date'], "receipt", "date"],
    [[$fn, $tname, 'invoice_no'], "receipt", "invoice"],
    [[$fn, $tname, 'source'], "receipt", "source"],
    //
    //The supplier infomation
    [[$fn, $tname, 'supplier'],  "business", "title", ["supplier"]],
    [[$fn, $tname, 'supplier_title'], "business", "name", ["supplier"]],
    [null, "supplier", "supplier" ,["supplier"]],
    //
    //The consumer infomation
    [[$fn, $tname, 'consumer'],"business", "title", ["consumer"]],
    [[$fn, $tname, 'consumer_title'],  "business", "name", ["consumer"]],
    [null, "consumer", "consumer", ["consumer"]],
    //
    //Item  
    [[$fn, $tname, 'units'], "item", "unit"],
    [[$fn, $tname, 'description'], "item", "name"],
    [[$fn, $tname, 'currency'], "item", "currency"],
    [[$fn, $tname, 'price'], "item", "price"],
    //
    //Qty
    [[$fn, $tname, 'qty'], "qty", "value"],
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;
