<?php
//
//To help in prevention of conficts that occur from usage of simmilar names
//and logically organize our code
namespace mutall\capture;
//
//Get the functionality that will help in writing the data to the db from the questionaaire lib
include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
include '../../../schema/v/code/path.php';
//
//Create an instance that will facilitate the loading of data to the balansys database
$q = new \mutall\questionnaire("balansys");
//
//The name of the table we will construct with the sql data. TO avoid repetition store it here
$tname/* string */  = 'folders';
//
//Read the sql from the balansys sql file with help from the path lib
//
//The path instance will help in reading of the contents of the sql file
$inst = new \mutall\path('/balansys/v/code/balansys.sql', true);
//
//The sql that will be used to retrieve data from the database
$sql/* string */ = $inst -> get_file_contents();
//
//Consturct a table form the balansys database using the results of the above defined query
$table = new query(
        //
        //The name of the text table    
        $tname,
        //
        //The sql statement to get the data
        $sql,
        //
        //The dbase to execute the query aganist
        'balansys'
);
//
//Define the look up function that will be used to retrieve data from the table
$fn/* string */ = '\mutall\capture\lookup';
//
//Map data from a csv file to a the database
$layout /* Array<layout> */= [
    $table,
    [[$fn, $tname, 'folder_name'], "folder", "full_name"],
    [[$fn, $tname, 'original'], "image", "full_name"],
    [[$fn, $tname, 'file_name'], "image", "short_name"],
    [null, "receipt", "receipt"],
    [[$fn, $tname, 'consumer'], "consumer", "name"]
];
//
//Load the data using the most common method
$result /* 'ok' | string */= $q -> load_common($layout);
//
//show the results of the loading process
echo $result;
