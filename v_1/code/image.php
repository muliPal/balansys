<?php

//
//Import the schema library to help in querying the database
include '../../../schema/v/code/schema.php';
//
//Import the questionnaire to facilitate writing to the database
include '../../../schema/v/code/questionnaire.php';

//
//Collect all the images in the given folder then save them to the database
function save_images(string $directory)/* 'Ok'|Array<string> */ {
    //
    //Create an error colleciton mechanisim to collect errors
    $errors = [];
    //
    //Get the images
    $images = get_images($directory);
    //
    //Save the images
    foreach ($images as $image) {
        //
        //Save the image
        $result = save_image($image, $directory . "/" . $image);
        //
        //Record the erronious cases
        if ($result !== "Ok")
            $errors[$image] = $result;
    }
    //
    //Check to see if there were any errors
    if (empty($errors))
        return "Ok";
    //
    //Return the errors
    return $errors;
}

//
//Get all the image files in the given folder
//Scan the directory and get all the files and folders then filter them to only obtain the image files
//using a regular expression
function get_images(string $directory)/* Array<string> | false */ {
    //
    //Get all the files in the folder
    $files = scandir($directory);
    //
    // Define a regular expression to filter out all the image files
    $imageExtensions = "/\.(jpg|jpeg|png|gif)$/i";
    //
    //Use preg_grep to filter the files array based on the regular expression
    $imageFiles = preg_grep($imageExtensions, $files);
    //
    //Return all the image files retrieved
    return $imageFiles;
}

//
//Given the name and the path to an image save it to the database
//Using the questionnaire library collect the layouts and load the data
//to the dbase using the load common method
function save_image(string $name, string $file)/* 'Ok'|string */ {
    //
    //Create an instance of the questionnaire class
    $quest = new \mutall\questionnaire("balansys");
    //
    //Encode the image as a string
    $image = file_get_contents($file);
    //
    //Generate the directory name
    $dir = str_replace($name, "", str_replace("./images/", "", $file));
    //
    //Create layouts for saving the image
    $layouts = [
        //
        //The actual picture
        [$image, "image", "picture"],
        //
        //The folder where the image was loaded from
        [$dir, "folder", "name"],
        //
        //The name of the image file
        [$name, "image", "name"],
    ];
    //
    //Load the data to the dbase using the questionnaire
    $result/* :'Ok'|string */ = $quest->load_common($layouts, "log.xml");
    //
    //Return the result of the operation
    return $result;
}

//
//Test the saving of images
print_r(save_images("../../images/malimali"));

