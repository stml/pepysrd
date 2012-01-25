<html>
<head>
<title>Pepys Rd Artyfacts</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles.css' />

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script>
<script type="text/javascript" src="http://tile.cloudmade.com/wml/latest/web-maps-lite.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>  
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">
	google.load('visualization', '1.0', {'packages':['corechart']});
</script>
  
</head>
<body onload="initialise()">

<div class="container">

<? if($_GET['postcode']) { ?>

<h1>Pepys Rd, <?=$_GET['postcode']?></h1>

<? 
include('ops.php'); 
$ops = new Ops(); 
if ($ops->checkPostcode($_GET['postcode'])) { ?>

<h3>A Chart</h3>

<div id="chart_div"></div>

<script type="text/javascript">

function initialise() {
	var opts = {sendMethod: 'xhr'};
	var query = new google.visualization.Query('http://spreadsheets.google.com?key=0ArEEeSYZKV8bdDQ2RGotenYzYWhYTFlEREhRb2tXMlE', opts);
	query.send(handleQueryResponse);
	}


function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
		}
	var data = response.getDataTable();
	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	chart.draw(data, {width: 400, height: 240, is3D: true});
	}
</script>
	
<?	}
else {
	echo '<p>Sorry, that postcode is invalid. (We need the full postcode).</p>';
	}
?>


	
<? } else { ?>

<h1>Pepys Rd</h1>

<p><a href="http://shorttermmemoryloss.com/sandbox/pepysrd">Go back</a></p>


<? } ?>

</div>

</body>
</html>