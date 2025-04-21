<?php
namespace mutall\capture;

include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
//
//Load the mappings to a database
$q = new \mutall\questionnaire("tracker_mogaka");
//
//
$layout = [
    //
    //intern infomation 
    ["Karen Nandi", "intern", "name"],
    ["Nandi", "intern", "surname"],
    ['KN', "intern", "initials"],
    ['Tuesday', "intern", "day"],
    ['2024-02-01', "intern", "start_date"],
    ['2024', "intern", "year"],
    ['Jomo Kenyatta University of Agriculture and Technology', "intern", "university"],
    //
    //workplan infomation
    ['2024', "workplan", "year"],
    //
    //project infomation
    //
    //ranix

    ['ranix', "project", "name", ['ranix']],
    ['client-server communication', "project", "theme", ['ranix']], 
    //
//    //Portfolio
    ['Portfolio', "project", "name", ['portfolio']],
    ['kklwejk', "project", "problem", ['portfolio']],
//    //
    //Library usage
    ['ranix', "project", "name",['library']],
];
//
//Load the data using the most common method
$result = $q -> load_common($layout);
//
//print the q
echo $result;
