  <?php
    //Put ,muli's name in the $name variable
    $name[0]=$_POST['username'][0];
    $name[1] =$_POST['username'][1];
    
?>
<html>
<body>
  
    <h1>WELCOME TO MY FIRST PHP</h1>
    <h2>Name1 <?php echo $name[0]; ?></h2>
    <h2>Name2 <?php echo $name[1]; ?> </h2>
</body>
</html>
