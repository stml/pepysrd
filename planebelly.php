<?php
/* 
Flightaware.com FlightXML API Key: 25b79741e1f237b54522390c71981a50496d2b0e
*/
?>
<html>
<head>
<title>Flight Overhead</title>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>  
<script src="jquery.backstretch.min.js" type="text/javascript"></script>
<script type="text/javascript">

var map;
var planemarker = 'plane_marker.gif';

$(document).ready(function() {
		$.backstretch("plane_belly.jpg", {speed: 150});
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			getNearbyFlight(position.coords.latitude,position.coords.longitude);
			});
		}
	else {
		alert('Sorry, geolocation not possible');
		}
	});
	
function getNearbyFlight(latitude,longitude) {
	var fxml_url = 'http://stml:25b79741e1f237b54522390c71981a50496d2b0e@flightxml.flightaware.com/json/FlightXML2/';
	var minlat = latitude + 0.3;
	var minlon = longitude - 0.4;
	var maxlat = latitude - 0.3;
	var maxlon = longitude + 0.4;
	var query = '-latlong "'+minlat+' '+minlon+' '+maxlat+' '+maxlon+'"';
	$.ajax({
		type: 'GET',
		url: fxml_url + 'Search', 
		data: { 'query': query, 'howMany': 10, 'offset': 0 },
		success : function(result) {
			$('.working').css("display","none");
			$('#info').append('The nearest planes to you are:<br>');
			for (var i in result.SearchResult.aircraft) {
				var flight = result.SearchResult.aircraft[i];
				$('#info').append("<a href='http://flightaware.com/live/flight/"+flight.ident+"' target='_blank'>"+flight.ident+"</a>, "+flight.origin+"&rarr;"+flight.destination+", heading "+flight.heading+"&deg; at "+flight.groundspeed+"mph at "+flight.altitude+" feet.<br>");
  				}
		},
		error: function(data, text) { alert('Failed to fetch flight: ' + data); },
		dataType: 'jsonp',
		jsonp: 'jsonp_callback',
		xhrFields: { withCredentials: true }
		});
	}
	
</script>
<style type="text/css">
	* { margin: 0; padding: 0; }
	body { width: 100%; height: 100%; text-align: center; }
	#info { width: 500px; background: #fff; opacity: 0.75; moz-opacity: 0.75; padding: 25px; margin: 200px auto; }
</style>
</head>
<body>
<div id="info" class="ll">
<p class="working"><blink>working</blink></p>
</div>
</body>
</html>