<?php
require ('./query.php');
// start the session
session_start();

// This is the state we're in
$state = $_SESSION['state'];
// Previous query (if there is one)
$state = $_SESSION['query'];

// Create the state if you're ready!
if(!strlen($state)) {
	$state = 'QUERY';
}

$sender = $_POST["From"] // The phone number that sent this message.
$query = $_POST["Body"] // The text body of the SMS message. Up to 160 characters long.
$pieces = explode(",", $_POST["Body"], 2); // Split the query into two

$results = get_results($pieces[0], $pieces[1]); // Pass in the data

$message=''; // The final message to be sent

if(count($results)>1) // Handles if there is more than result
{
	if($state = 'MORE' && strcasecmp( 'MORE' , $query )==0) // Set back to QUERY after a MORE
	{
		$message=$results[0]." ".$results[1];
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
if(count($results==1))
{
	$message=$results[0]." ".$results[1];
}

if(empty($result))
{
	$message='No results found!';
}

$_SESSION['state'] = $state;

header("content-type: text/xml");
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
	<sms><?php echo $message; if(count($results)>1 && $state=='QUERY' ) ' Text MORE for more results.'; ?></sms>
</Response>