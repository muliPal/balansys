<?php

//
//To avoid conflict with the php reserved keywords

namespace mutall\capture;

//
//Get Library code that will help in loading of the data
include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Create a new object that will facilitate loading data to the database
$q = new \mutall\questionnaire("balansys");
//
//The name of the table that will be created (done as a variable for reuabliity)
$tname = 'images';
//
//Create a table out of the files in the specified folder
$table = new scandisk(
        //
        //The name of the text table
        $tname,
        //
        //The name of the image directory
        '/balansys/images'
);
//
//To avoid repetition define the look up function for retieving data from the
//table created above
$fn = '\mutall\capture\lookup';

// $exp = new lookup($tname, 'intern');
//
//Map data from the folder to the database
$layout = [
    //
    //The table(source of data)
    $table,
    //
    //Recipt infomation
    //A look up of the table images column filename. The data from the lookup will
    //be stored at the image table name column
    [[$fn, $tname, 'filename'], "image", "name"],
    //
    //TODO:Add a header to get the actual contents of the file in th scandisk table
    [[$fn, $tname, 'content'], "image", "picture"]
];
//
//Load the data using the most common method
$result = $q->load_common($layout);
//
//print the q
echo $result;
