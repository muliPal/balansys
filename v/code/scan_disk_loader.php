<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("balansys");

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
    [[$fn, $tname, 'filename'], "image", "full_name"],
    //
    //TODO:Add a header to get the actual contents of the file in th scandisk table
    [[$fn, $tname, 'content'], "image", "picture"]
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;