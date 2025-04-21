<?php
//
//Local server
$server_name = 'localhost';
//
//Username
$username = 'root';
//
//password
$password = '';
//
//Remote Server
$r_server = '';
//
//Remote username
$r_username = '';
// 
//Remote password
$r_password = '';
//
//Form a connection to the local database
$conn = new PDO("mysql:host=$servername;dbname=mutall_balansys", $username, $password);
//
//Form a connection to the remote database
$r_conn = new PDO("mysql:host=$r_server;dbname=mutall_balansys", $r_username, $r_password);
//
//Set the PDO error mode to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//
//Set the PDO error mode to exception
$r_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//
//Retrieve data from the local database
$local_query = $conn->query("SELECT * FROM your_table");
//
//
$data_to_transfer = $local_query->fetchAll(PDO::FETCH_ASSOC);
//
//Insert data into the remote database
foreach ($data_to_transfer as $row) {
    $columns = implode(", ", array_keys($row));
    $values = ":" . implode(", :", array_keys($row));
    $remote_query = $r_conn->prepare("INSERT INTO your_remote_table ($columns) VALUES ($values)");
    $remote_query->execute($row);
}
//
//Close connections to both databases after finishing the transfer
$local_conn = null;
$remote_conn = null;

