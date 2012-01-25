<html>
<head>
<title>dbtest</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles2.css' />
<script type="text/javascript" src="https://www.google.com/jsapi?key=ABQIAAAAA0wYKUL7VLJQyyxeKLMYmRQEuIKJCPPCTSYhFUIkFh_QsJZpEBTyVStR5YFaNbqHB5H7uYZ8k4gr8w"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

<script type="text/javascript">

google.load("visualization", "1");

$(document).ready(function() {  
  	initialise();
	});

function initialise() {
	var location = "Hammersmith";
	var lifeEx = lifeExpectancy(location);
	}

function lifeExpectancy(location) {
	var query = "select C where A = '00AB'";

	var query = "select C where A = '00AB'";
	var datasource = 'https://docs.google.com/spreadsheet/tq?key=0ArEEeSYZKV8bdGpCUDJUVWdua1Y0T3RteUZaM05QZlE&gid=4&headers=-1';
	querydoc(datasource, query);
	}
	
function querydoc(datasource, query) {
	var q = new google.visualization.Query(datasource);
	q.setQuery(query);
	q.send(responseHandlerCallback);
	}
	
function responseHandlerCallback(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
  		}
  	var data = response.getDataTable();
  	// Only one result, so...
	console.log(data.getFormattedValue(0,0));
	}
</script>

</head>
<body>

<div class="container">

<p id="output"></p>

</div>

</body>
</html>