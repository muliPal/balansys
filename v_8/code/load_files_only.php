<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys_temp");

$tname = 'images';

$table = new scandisk(
        //
        //The name of the text table    
        $tname,
       //
       //The name of the image directory
        '/balansys/images'
);

$fn = '\mutall\capture\lookup';

// $exp = new lookup($tname, 'intern');
//
//Map data from the folder to the database
$layout = [
    $table,
    //
    //Recipt infomation 
    [[$fn, $tname, 'filename'], "image", "name"],
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;
