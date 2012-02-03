var map;
var planemarker = 'plane_marker.gif';
var latitude;
var longitude;

$(document).ready(function() {
		$.backstretch("plane_belly.jpg", {speed: 150});
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			getNearbyFlight();
			});
		}
	else {
		alert('Sorry, geolocation not possible');
		}
	});
	
function getNearbyFlight() {
	var fxml_url = 'http://stml:25b79741e1f237b54522390c71981a50496d2b0e@flightxml.flightaware.com/json/FlightXML2/';
	var minlat = latitude + 0.3;
	var minlon = longitude - 0.4;
	var maxlat = latitude - 0.3;
	var maxlon = longitude + 0.4;
	var query = '-latlong "'+minlat+' '+minlon+' '+maxlat+' '+maxlon+'"';
	$.ajax({
		type: 'GET',
		url: fxml_url + 'Search', 
		data: { 'query': query, 'howMany': 50, 'offset': 0 },
		success : function(result) { sortFlights(result) },
		error: function(data, text) { alert('Failed to fetch flight: ' + data); },
		dataType: 'jsonp',
		jsonp: 'jsonp_callback',
		xhrFields: { withCredentials: true }
		});
	}
	
function sortFlights(result) {
	var flights = [];
	for (var i in result.SearchResult.aircraft) {
		var flight = result.SearchResult.aircraft[i];
		if (flight.altitude > 0) {
			var thisFlight = [];
			thisFlight['distance'] = calcDistance(flight.latitude, flight.longitude, latitude, longitude);
			thisFlight['altitude'] = flight.altitude;
			thisFlight['latitude'] = flight.latitude;
			thisFlight['longitude'] = flight.longitude;
			thisFlight['bearing'] = ''; // calc this later
			thisFlight['ident'] = flight.ident;
			thisFlight['origin'] = flight.origin;
			thisFlight['destination'] = flight.destination;
			thisFlight['heading'] = flight.heading;
			thisFlight['groundspeed'] = flight.groundspeed;
			thisFlight['type'] = flight.type;
			thisFlight['departureTime'] = flight.departureTime;
			flights.push(thisFlight);
			}
  		}
  		nearestFlight = flights[0];
  		for (var i in flights) {	
  			if (flights[i].distance < nearestFlight['distance']) {
  				nearestFlight = flights[i];
  				}
  			}
  		nearestFlight['bearing'] = calcBearing(latitude, longitude, thisFlight['latitude'], thisFlight['longitude']);
  		var date = new Date(nearestFlight['departureTime']*1000);
  		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (minutes.length < 2) { var departuretime = hours + ':0' + minutes; }
		else { var departuretime = hours + ':' + minutes; }
	
		$.ajax({
        	type: "GET",
        	url: "airportcodes.csv",
        	dataType: "text",
        	success: function(data) {
        		var lines = data.split(/\r\n|\n/);
				for (var i=0; i<lines.length; i++) {
        			var data = lines[i].split(',');
        			if (data[1] == nearestFlight['origin']) {
        				nearestFlight['origin_name'] = data[3].replace(/\;/g,",");
        				nearestFlight['origin_iata'] = data[0];
        				}
        			if (data[1] == nearestFlight['destination']) {
        				nearestFlight['destination_name'] = data[3].replace(/\;/g,",");
        				nearestFlight['destination_iata'] = data[0];
        				}
					}
				  	$('.working').css("display","none");
					
					if (	nearestFlight['type'].substring(0,1) == 'A'
						||	nearestFlight['type'].substring(0,1) == 'E'
						||	nearestFlight['type'].substring(0,1) == 'I'
						|| 	nearestFlight['type'].substring(0,1) == 'O'
						||	nearestFlight['type'].substring(0,1) == 'U'
						||	nearestFlight['type'].substring(0,1) == 'H') {
							var typestring = 'An '+nearestFlight['type'];
						}
					else {
							var typestring = 'A '+nearestFlight['type'];
						}
					
$('#info').html(nearestFlight['distance']+" miles to the "+nearestFlight['bearing']+" of you, right now.<br><br>"+typestring+" plane, at "+nearestFlight['altitude']+"00 feet, travelling at "+nearestFlight['groundspeed']+"mph on a heading of "+nearestFlight['heading']+"&deg;: <a href='http://flightaware.com/live/flight/"+nearestFlight['ident']+"' target='_blank'>Flight "+nearestFlight['ident']+"</a> to "+nearestFlight['destination_iata']+" ("+nearestFlight['destination_name']+"), which took off from "+nearestFlight['origin_iata']+" ("+nearestFlight['origin_name']+") at "+departuretime+".");
					//callAMEE(nearestFlight['type'],nearestFlight['origin_iata'],nearestFlight['destination_iata']);
			}
		});
		

	}
	
function calcDistance(startlat, startlon, endlat, endlon) {
	// distance
	var R = 6371; // km
	var dLat = (endlat-startlat)*(Math.PI / 180);
	var dLon = (endlon-startlon)*(Math.PI / 180);
	var lat1 = (startlat)*(Math.PI / 180);
	var lat2 = (endlat)*(Math.PI / 180);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	var totalDistanceInMiles = Math.round(d * 0.621371192);
	return totalDistanceInMiles;
  	}
function calcBearing(lat1, lon1, lat2, lon2) {
	var dLon = (lon2 - lon1);
	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	var brng1 = Math.atan2(y, x);
	var brng2 = brng1 * 180 / Math.PI;
	var brng3 = (brng2+360) % 360;
	if (brng3 >= 337.5 || brng3 < 22.5) { return 'North'; }
	else if (brng3 >= 22.5 && brng3 < 67.5) { return 'Northeast'; }
	else if (brng3 >= 67.5 && brng3 < 112.5) { return 'East'; }
	else if (brng3 >= 112.5 && brng3 < 157.5) { return 'Southeast'; }
	else if (brng3 >= 157.5 && brng3 < 202.5) { return 'South'; }
	else if (brng3 >= 202.5 && brng3 < 247.5) { return 'Southwest'; }
	else if (brng3 >= 247.5 && brng3 < 292.5) { return 'West'; }
	else if (brng3 >= 292.5 && brng3 < 337.5) { return 'Northwest'; }
	}
	
/*
function callAMEE(plane_type, origin_iata,destination_iata) {
	var url = 'https://stage.amee.com/data/transport/plane/specific/jet/drill?type=plane_type';
	var url = 'https://stage.amee.com/data/transport/plane/specific/jet?IATACode1='+origin_iata+'&IATACode2='+destination_iata;
	console.log(plane_type);
	}
*/
	
	
	
	
	
	
	
	