<html>
<head>
<title>Pepys Rd : Hello</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles2.css' />

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script> 
<script src="jquery.min.js" type="text/javascript"></script>  
<script type="text/javascript" src="opening.js"></script>

</head>
<body>
<div id="querystring" style="display:none">
<span class="birthmonth"><?=$_POST["birthmonth"]?></span>
<span class="birthyear"><?=$_POST["birthyear"]?></span>
<span class="birthfulladdress"><?=$_POST["birthaddress"]?></span>
<span class="currentfulladdress"><?=$_POST["currentaddress"]?></span>
<span class="birthyear"><?=$_POST["birthyear"]?></span>
<span class="birthlatitude"><?=$_POST["birthlatitude"]?></span>
<span class="birthlongitude"><?=$_POST["birthlongitude"]?></span>
<span class="currentlatitude"><?=$_POST["currentlatitude"]?></span>
<span class="currentlongitude"><?=$_POST["currentlongitude"]?></span>
<span class="birthcountry"><?=$_POST["birthcountry"]?></span>
<span class="currentcountry"><?=$_POST["currentcountry"]?></span>
</div>

<div class="container">

<div class="sign"><h1>PEPYSRD.COM</h1> <span class="green">SW6</span> <span class="red">CITY OF SOMEWHERE</span></div>

<h3 id="yearsdistance"></h3>

<p><span id="distance"></span> <span id="lifeexpectancydifference"></span> <span id="incomedifference"></span> <span id="housepricedifference"></span></p>

<p><em>(Tweet/FB/Tumbl a short version of this, with a shortlink to the diagrams below)</em></p>

<div id="directions_map" style="width: 700px; height: 330px;"></div>

<div class="col_container">
<div id="birthplace" class="col_left">
<h3 class="birthshortaddress"></h3>
<ul>
</ul>
</div>
<div id="currentplace" class="col_right">
<h3 class="currentshortaddress"></h3>
<ul>
</ul>
</div>
</div>

<h3>But what do the next ten years look like?</h3>

<p><em>(blurb)</em></p>

<p>Give us your email address, or follow @pepysrd on Twitter to find out...</p>

<p>Credits</p>
<ul>
<li>Property price data from <a href="http://www.nestoria.co.uk">Nestoria</a></li>
<li>Local Authority locations from <a href="http://mapit.mysociety.org/">MaPit</a> <em>[We need a license]</em></li>
<li>Life Expectancy data from <a href="http://www.statistics.gov.uk/hub/population/deaths/life-expectancies">UK National Statistics</a></li>
<li>Household income from <a href="http://www.ons.gov.uk/ons/publications/re-reference-tables.html?edition=tcm%3A77-235202">Office of National Statistics / data.gov.uk</a></li>
</ul>

</form>

</div>

</body>
</html>