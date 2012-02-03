<html>
<head>
<title>Pepys Rd : Hello</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles2.css' />

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
<script src="indexform.js" type="text/javascript"></script>

</head>
<body>

<div class="container">

<div class="sign"><h1>PEPYSRD.COM</h1> <span class="green">SW6</span> <span class="red">CITY OF SOMEWHERE</span></div>

<p><em>(Something encouraging...)</em></p>

<form id="entryform" action="opening.php" method="post">
<p>I was born in <select id="birthmonth" name="birthmonth" />
<option value="1">January</option>
<option value="2">February</option>
<option value="3">March</option>
<option value="4">April</option>
<option value="5">May</option>
<option value="6">June</option>
<option value="7">July</option>
<option value="8">August</option>
<option value="9">September</option>
<option value="10">October</option>
<option value="11">November</option>
<option value="12">December</option>
</select> <select id="birthyear" name="birthyear" /><? for ($i=2010;$i>1900;$i--) { echo '<option value="'.$i.'">'.$i.'</option>'; } ?></select> and grew up in <input type="text" id="birthaddress" name="birthaddress" value=" " />. Now I live in <input type="text" id="currentaddress" name="currentaddress" value=" " />.</p>
<input type="hidden" id="birthlatitude" name="birthlatitude" value="" />
<input type="hidden" id="birthlongitude" name="birthlongitude" value="" />
<input type="hidden" id="currentlatitude" name="currentlatitude" value="" />
<input type="hidden" id="currentlongitude" name="currentlongitude" value="" />
<input type="hidden" id="birthcountry" name="birthcountry" value="" />
<input type="hidden" id="currentcountry" name="currentcountry" value="" />

<p><input id="submitbutton" type="submit" value="Let's Go" /></p>
</form>

</div>

</body>
</html>