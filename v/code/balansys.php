<?php
include '../../../schema/v/code/schema.php';
include '../../../schema/v/code/questionnaire.php';
include '../../../schema/v/code/path.php';
//This php class is responsible for loading of receipt images and some information on the consumer 
//to the balansys database
class balansys{
    //
    //An instance of the questionnaire to help in loading of data to the db
    public $questionnaire_inst;
    //
    //Define the look up class that will be used to retrieve data from the table
    public static $fn/* string */ = '\mutall\capture\lookup';
    //
    function __construct(){
        //
        //Create a questionnaire instance to help with loading of the savannah files to the dbase
        $this -> questionnaire_inst = new \mutall\questionnaire("balansys");
    }
    //
    //Get the imges to load from the disk
    function get_receipt_image($tname= "table"){
        //
        //Create a table from scaning the balansys/images folder
        return new \mutall\capture\scandisk(
            //
            //The name of the text table    
            $tname,
            //
            //The name of the image directory
            '/balansys/images'
        );
    }
    //
    //Load the receipt image to the dbase
    function load_receipt_image(){
        //
        //The name of the table this will be usefull in doing the lookups
        $tname/* string */  = 'images';
        //
        //Get all the receipt as a table
        $image_table = $this -> get_receipt_image($tname);
        //
        //Map data from the folder to the database
        $layout = [
            $image_table,
            //
            //Recipt infomation 
            [[balansys::$fn, $tname, 'filename'], "image", "full_name"],
        ];
        //
        //Load the data using the most common method
        return $this -> questionnaire_inst -> load_common($layout);
    }
    //
    //Generate labels for only images that are not alredy saved to the database
    function collect_layouts
    //
    //Get all the data from the database and create a table with the data
    function get_receipts($tname = "table"){
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
        return new \mutall\capture\query(
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
    }
    //
    //Load the reciepts and the corresponding consumer businesses
    function load_receipts(){
        //
        //The name of the table we will construct with the sql data. TO avoid repetition store it here
        $tname/* string */  = 'folders';
        //
        //Get the receipts from the to load by querying the images table since images are receipts
        $table = $this -> get_receipts($tname);
        //
        //Map data from a csv file to a the database
        $layout /* Array<layout> */= [
            $table,
            [[balansys::$fn, $tname, 'folder_name'], "folder", "full_name"],
            [[balansys::$fn, $tname, 'original'], "image", "full_name"],
            [[balansys::$fn, $tname, 'file_name'], "image", "short_name"],
            [null, "receipt", "receipt"],
            [[balansys::$fn, $tname, 'consumer'], "consumer", "name"]
        ];
        //
        //Load the data using the most common method
        return $this->questionnaire_inst -> load_common($layout);
    }
    //
    //Load the images into the database and after successully loding the images proceed to load the 
    //consumer businesses
    function load (){
        //
        //Load the images into the database
        $result = $this -> load_receipt_image();
        // //
        // //If loading the receipts was not successfull alert the user 
        // if($result != "ok")  throw new Exception("AN ERROR OCCURED WHILE LOADING THE IMAGES"+ $result);
        // //
        // //Load the consumer businesses
        // $this ->load_receipts();
    }
}

$inst = new balansys();
$inst -> load();