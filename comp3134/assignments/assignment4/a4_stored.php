<?php
$lines = file('a4_toread.txt');
 
foreach ($lines as $line) {
    echo $line;
    echo "<br>";
}
?>