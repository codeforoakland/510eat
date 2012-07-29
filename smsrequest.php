<?php
require ('./query.php');
// Allows me do debug!
error_reporting(E_ALL);
ini_set("display_errors",1);

//setcookie("TestCookie", 'lolhi', time()+250); // Expires after 3-ish minutes 
$message='Something went wrong.'; // The final message to be sent
$query = $_POST["Body"]; // The text body of the SMS message. Up to 160 characters long.
$pieces = explode(',', $query, 2); // Split the query into two
// echo "lol uh oh";
$results = get_results($pieces[0], $pieces[1]); // Pass in the data

if(count($results)>-1) // Handles if there is more than one result (disabled for now)
{
	if($state = 'MORE' && strcasecmp( 'MORE' , $query )==0) // Set back to QUERY after a MORE
	{
		$message=$results[0].' '.$results[1];
		$state = 'QUERY';
		$_SESSION['query']='';
	}
	else // 
	{
		$message=$results[0]." ".$results[1];
		$_SESSION['query'];
		$state = 'MORE';
	}
}

if(count($results>=1))
{
	$message=$results[0]." ".$results[1];
}

if(empty($result))
{
	$message='No results found!';
}

header("content-type: text/xml");
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
	<sms><?php echo $message;?><<?php if(count($results)>1) echo ' Text MORE for more results.'; ?>/sms>
</Response>
