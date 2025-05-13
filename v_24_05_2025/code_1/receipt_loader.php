<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");

//This is the mpesa table
$table = new csv(
        'mpesa',
        'D:/mutall_projects/balansys/data/mpesastatement2.csv'
);

//
//The mapping is defined by the laout variable, using the following pattern
//[exp, ename, cname]
$layout = [
    $table,
    [new lookup('mpesa', 'Receipt No.'), 'payment', 'ref'],
    [new lookup('mpesa', 'Completion Time'), 'payment', 'date'],
    [new lookup('mpesa', 'Details'), 'payment', 'details'],
    [new lookup('mpesa', 'Withdrawn'), 'payment', 'amount']
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;
