<?php

namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");
//is this the excel table or db table?
//This is the mpesa table
$table = new csv(
        //
        //what is specified here?????
        'mpesa',
        'D:/mutall_projects/balansys/data/2024_expense.csv'
);

//
//The mapping is defined by the laout variable, using the following pattern
//[exp, ename, cname]
$layout = [
    $table,
    //
    //what should i specify where there is 'mpesa'
    //should i load the image and folder names again?
    //how do i populate the business table?
    [new lookup('mpesa', 'receipt_date'), 'receipt', 'date'],
    [new lookup('mpesa', 'supplier_name'), 'supplier', 'name'],
    [new lookup('mpesa', 'receipt_ref'), 'receipt', 'ref'],
    [new lookup('mpesa', 'purchase_qty'), 'purchase', 'qty'],
    [new lookup('mpesa', 'purchase_unit'), 'purchase', 'unit'],
    [new lookup('mpesa', 'purchase_qty'), 'purchase', 'qty'],
    [new lookup('mpesa', 'purchase_unit'), 'purchase', 'unit'],
    [new lookup('mpesa', 'product_code'), 'product', 'code'],
    [new lookup('mpesa', 'product_name'), 'product', 'name'],
    [new lookup('mpesa', 'purchase_price'), 'purchase', 'price'],
    [new lookup('mpesa', 'purchase_vat'), 'purchase', 'vat'],
    [new lookup('mpesa', 'receipt_amount'), 'receipt', 'amount'],
    [new lookup('mpesa', 'consumer_name'), 'consumer', 'name'],
];
//
//Load the data using the most common method
$result = $q->load_common($layout);
//
//print the q
echo $result;
