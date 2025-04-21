<?php

namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//This is the mpesa table
$table = new csv(
        'mpesa',
        'D:/mutall_projects/balansys/data/mpesastatement2.csv'
);

$table = new csv(
        //
        //The name of the text table    
        $tname,
        //
        //The filename that holds the (milk) data    
        'diaspora.csv',
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
    //stock infomation 
    [[$fn, $tname, 'qty'], "stock", "qty"],
    [[$fn, $tname, 'unit'], "stock", "unit"],
    //
    //product infomation 
    [[$fn, $tname, 'item'], "product", "name"],
    [[$fn, $tname, 'category'], "product", "category"],
    [[$fn, $tname, 'unit'], "product", "unit"],
     //
     //staff infomation 
    [[$fn, $tname, 'staff_name'], "staff", "name"],
     //
      //session infomation 
    [[$fn, $tname, 'date'], "session", "date"],
    [[$fn, $tname, 'session_no'], "session", "num"],
];
//
//Load the data using the most common method
$result = $q->load_common($layout,);
//
//print the q
echo $result;
