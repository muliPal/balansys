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
    //payment information
    ['03/02/2024  07:42:40', "payment", "date"],
    
    ['SB31WH0TBH', "payment", "ref"],
    
    ['Customer Transfer to -07******298 BENARD PALSTAU',
        "payment", "details"],
    
    ['-12000', "payment", "amount"],
    
];
//
//Local name of our table
$tname = 'payment';

//
//The column names of the above table
$cnames = ['ref', 'date', 'details', 'amount'];

//
$payment = new matrix(
    $tname,
    $cnames,
    $array
);

//Define thelooup function
$fn = '\mutall\capture\lookup';

//
//Load the data using the most common method
$result = $q -> load_common($layout, '/balansys/v/code/log.xml', '/balansys/v/code/error.html');
//
//print the q
echo $result;
