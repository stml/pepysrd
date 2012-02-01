<?php
/* 
Flightaware.com FlightXML API Key: 25b79741e1f237b54522390c71981a50496d2b0e
*/
?>
<html>
<head>
<title>Flight Overhead</title>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script> 
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>  
<script type="text/javascript">

var map;
var planemarker = 'plane_marker.gif';

$(document).ready(function() {
	var mapOptions = {
          center: new google.maps.LatLng(51.52276, -0.103842),
          zoom: 5,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			$('.ll').html('You are at: ('+position.coords.latitude + ", " + position.coords.longitude+")");
			var currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			map.panTo(currentPosition);
			map.setZoom(10);
			var marker = new google.maps.Marker({
      			position: currentPosition,
      			map: map,
      			title:"You Are Here"
  				});
			getNearbyFlight();
			});
		}
	else {
		alert('Sorry, geolocation not possible');
		}
	});
	
function getNearbyFlight() {
	var fxml_url = 'http://stml:25b79741e1f237b54522390c71981a50496d2b0e@flightxml.flightaware.com/json/FlightXML2/';
	var mapBounds = map.getBounds();
	var ne = mapBounds.getNorthEast();
	var sw = mapBounds.getSouthWest();
	var query = '-latlong "'+ne.lat()+' '+ne.lng()+' '+sw.lat()+' '+sw.lng()+'"';
	$.ajax({
		type: 'GET',
		url: fxml_url + 'Search', 
		data: { 'query': query, 'howMany': 10, 'offset': 0 },
		success : function(result) {
			console.log(result);
			var flightcount = 0;
			for (var i in result.SearchResult.aircraft) {
				var flight = result.SearchResult.aircraft[i];
				var flightposition = new google.maps.LatLng(flight.latitude,flight.longitude);
				var windowString = "<strong>"+flight.ident+"</strong><br>"+flight.origin+"&rarr;"+flight.destination+"<br>Heading: "+flight.heading+"<br>Altitude: "+flight.altitude+"<br>Groundspeed: "+flight.groundspeed;
				window['flightwindow'+i] = new google.maps.InfoWindow({content: windowString});
				window['flightmarker'+i] = new google.maps.Marker({
      				position: flightposition,
      				map: map,
      				icon: planemarker
  					});
  				google.maps.event.addListener(window['flightmarker'+i], 'click', function() {
  					window['flightwindow'+i].open(map,window['flightmarker'+i]);
					});
				flightcount++;
  				}
			$('.ll').append(' &mdash; '+flightcount+' flights nearby.');
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
	body { width: 100%; height: 100%; }
	#map { width: 100%; height: 100%; }
	#info { position: fixed; width: 50%; background: #fff; bottom: 25px; left: 25px; padding: 10px; }
</style>
</head>
<body>
<div id="map"></div>
<p id="info" class="ll"><blink>working</blink></p>
</body>
</html>