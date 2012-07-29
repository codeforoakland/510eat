<!DOCTYPE html>
<!-- Handmade with love by Adrian -->
<head>
<title>SMS tester</title>
</head>
<body>
<form action="smsrequest.php" method="POST">
  Source number: <input type="text" name="From" value="+15551231234" /><br />
  Destination number: <input type="text" name="To" value="+14155551234" /><br />
  Message: <input type="text" name="Body" value="Taco Bell, Decoto" /><br />
  City (of the sending number): <input type="text" name="FromCity" value="Oakland, CA" /><br />
  
  <input type="submit" value="Submit" />
</form>
</body>
