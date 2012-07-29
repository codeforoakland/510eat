<?php
	include ("FiveOneOhEats.class.php");	
	global $fiveoneoheats;
?>
<pre>
<?php 
	$result = $fiveoneoheats->get_results($_GET['query'], $_GET['street']);
	print_r($result);
?>
</pre>
