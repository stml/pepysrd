var map;
var pano;
var carMarker;
var carRoute;
var directions;
var route;
var vertices;
var carRoute;
var bearing;
var nextBearing;
var nextVertexId;
var nextVertex;
var currentVertex;  
var currentLatLng;
var advanceTimer = null;
var advanceDelay = 1;
var driving = false;
var close = false;
var endLatLng;
var lastLatLng;
var totalDistance;
var stepDistance = 0;
var travelledDistance = 0;
travelledPercentage = 0;
        
$(document).ready(function() {
	var start = new google.maps.LatLng(51.507918,-0.128016);
    var myOptions = {
		zoom:3,
    	mapTypeControl: true,
    	mapTypeControlOptions: {
      		style: google.maps.MapTypeControlStyle.SMALL
    		},
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: start
		}
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    
    // create and hide the car marker
    carMarker = getCarMarker(start);
    carMarker.setMap(map);
    carMarker.setVisible(false);
    
    var panoramaOptions = {
    	panControl: false,
    	zoomControl: false,
    	addressControl: false,
    	linksControl: false
  		};
	pano = new google.maps.StreetViewPanorama(document.getElementById("streetview"), panoramaOptions);
	
	svClient = new google.maps.StreetViewService();
	directions = new google.maps.DirectionsService();
	
 	google.maps.event.addListener(pano, 'pano_changed', function() {
		moveCar();
        });
	
	generateRoute();   
    });


function generateRoute() {
	showInstruction("Loading...");
	if (carRoute) {
		carRoute.setMap(); // clear route
		}
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	var request = {
		origin: from,
		destination: to,
    	travelMode: google.maps.TravelMode.DRIVING
  		};
	directions.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsRoute = result;
			console.log(directionsRoute);
			totalDistance = (directionsRoute.routes[0].legs[0].distance.value)/1000;
			lastLatLng = directionsRoute.routes[0].legs[0].start_location;
			endLatLng = directionsRoute.routes[0].legs[0].end_location;
			displayRoute();
			}
		else {
			showInstruction("Could not generate a route for the current start and end addresses");
			}
		});
    }
    
function displayRoute() {
	/* get the first route */
	route = directionsRoute.routes[0];
	vertices = route.overview_path;
	/* draw the route map */
	carRoute = new google.maps.Polyline({
		path: vertices,
		strokeColor: "#CC0000",
		strokeOpacity: 0.5,
		strokeWeight: 5
		});
	carRoute.setMap(map);
	/* center the map at the start */
	map.setCenter(vertices[0]);
	map.setZoom(16);
	/* check that we have coverage along the entire route */
	checkCoverage(0);
    }

// recursive function drives whole route to check coverage
function checkCoverage(step) {
	if (step == vertices.length) {
		stopDriving();
		jumpToVertex(0);
		} 
	else {
		svClient.getPanoramaByLocation(vertices[step], 50, function(svData, svStatus) {
			if (svStatus == 'UNKNOWN_ERROR') {
				/* Server error, retry once per second */
				setTimeout("checkCoverage(" + step + ")", 1000);
				}
			else if (svStatus == 'ZERO_RESULTS') {
				/* Coverage check failed */
				showInstruction("Street View coverage is not available for this route");
	          	} 
    	    else {
        	   /* Confirmed coverage for this step.
            	* Now check coverage for next step.
            	*/
				checkCoverage(step + 1);
          		}
			});
		}
    }

// jump to the next vertex initially, or if something goes wrong on the way    
function jumpToVertex(idx) {
	currentLatLng = vertices[idx];
	nextVertex = vertices[idx + 1];
	nextVertexId = idx + 1;
	console.log()
	bearing = getBearingFromVertex(idx);
	nextBearing = getBearingFromVertex(idx + 1);

	setCarMarkerImage(bearing);
	carMarker.setPosition(currentLatLng);
    carMarker.setVisible(true);

	currentVertex = vertices[idx];
	
	map.panTo(currentLatLng);
	map.setZoom(16);
	
	pano.setPosition(currentLatLng);
	pano.setPov({ heading: bearing, pitch: 0, zoom: 3 })

	svClient.getPanoramaByLocation(currentLatLng, 50, function(svData, svStatus) {
        if (svStatus == 'UNKNOWN_ERROR') {
			setTimeout("jumpToVertex(" + idx + ")", 1000);
			} 
		else if (svStatus == 'ZERO_RESULTS') {
			jumpToVertex(nextVertexId);
        	} 
        else {
        	checkDistanceFromNextVertex();
			moveCar();
			}
		});
	}
 
// when a link is called, update location of map and car marker, and prepare to advance
function moveCar() {
	currentLatLng = pano.getPosition();
	carMarker.setPosition(currentLatLng);
	map.panTo(currentLatLng);
	if (driving) {
		advanceTimer = setTimeout("advance()", advanceDelay * 1000);
		}
	}

// move from current pano to the next one along nearest bearing	
function advance() {
	// if within 50m of end, stop driving 
	if (currentLatLng.distanceFrom(endLatLng) < 0.05) {
		endReached();
		}
	
	// update total distance
	stepDistance = Math.round(currentLatLng.distanceFrom(lastLatLng)*100)/100;
	travelledDistance = travelledDistance + stepDistance;
	travelledPercentage = Math.round((travelledDistance/totalDistance)*100)/100;
	lastLatLng = currentLatLng;
	
	
	console.log(travelledDistance+"km travelled of "+totalDistance+"km ("+travelledPercentage+"%)");
	
	var panolinks = pano.getLinks();
	var selected = selectLink(bearing);
	if (close && nextBearing) {
		var selectedTurn = selectLink(nextBearing);
		if (selectedTurn.delta < 15) {
			selected = selectedTurn;
			incrementVertex();
			}
		}
	if (selected.delta > 40) {
		jumpToVertex(nextVertexId);
		} 
	else {
		var panAngle = getHeadingDelta(pano.getPov().heading, panolinks[selected.idx].heading);
		pano.setPov({ heading:panolinks[selected.idx].heading, pitch:0, zoom: 3 });
        setTimeout(function() {
			pano.setPano(panolinks[selected.idx].pano);
			}, panAngle * 10);
		}
	}

function selectLink(heading) {
	var Selected = new Object();
	var linkArray = pano.getLinks();

	for (var i = 0; i < linkArray.length; i++) {
		var d = getHeadingDelta(heading, linkArray[i].heading);
		if (Selected.delta == null || d < Selected.delta) {
			Selected.idx = i;
			Selected.delta = d;
			}
		}
		return Selected;
	}

    
/* VERTEX MANIPULATION
************************************************************************************************/

// return the bearing from the current vertex to the next one	
function getBearingFromVertex(n) {
	var origin = vertices[n];
	var destination = vertices[n+1];
	if (destination != undefined) {
		return getBearing(origin, destination);
		} 
	else {
		return null;
      }
    }
    
// check for next vertex; if close, increment vertex; otherwise increment progress bar
function checkDistanceFromNextVertex() {
	close = false;
	var d = currentLatLng.distanceFrom(nextVertex);
	var b = getBearing(currentLatLng, nextVertex);
	// check we haven't passed the vertex already
	if (getHeadingDelta(bearing, b) > 90) {
        incrementVertex();
        if (driving) {
			checkDistanceFromNextVertex();
			}
		} 
	else {
		if (d < 10) {
			close = true;
			}
		}
    }

// check if we've got to the end, otherwise increment vertex, bearing and car marker    
function incrementVertex() {
	if (! vertices[nextVertexId + 1]) {
		endReached();
		} 
	else {
		nextVertexId++;
		nextVertex = vertices[nextVertexId];
        bearing = getBearingFromVertex(nextVertexId - 1);
        nextBearing = getBearingFromVertex(nextVertexId);
        setCarMarkerImage(bearing);
		}
	}
    
/* Start/Stop buttons and controls
************************************************************************************************/

// start driving and update UI
function startDriving() {
	hideInstruction();
	document.getElementById("route").disabled = true;
	document.getElementById("stopgo").value = "Stop";
	document.getElementById("stopgo").setAttribute('onclick', 'stopDriving()'); 
	document.getElementById("stopgo").onclick = function() { stopDriving(); }
	driving = true;
	advance();
	}
   
// stop driving and update UI
function stopDriving() {
	driving = false;      
	if (advanceTimer != null) {
		clearTimeout(advanceTimer);
		advanceTimer = null;
		}     
	document.getElementById("route").disabled = false;
	document.getElementById("stopgo").disabled = false;
	document.getElementById("stopgo").value = "Drive";
	document.getElementById("stopgo").setAttribute('onclick', 'startDriving()'); 
	document.getElementById("stopgo").onclick = function() { startDriving(); }
	showInstruction('<a href="#" onclick="startDriving()">Drive</a>');
	}
	
function endReached() {
	stopDriving();
	showInstruction("The End");
	}

/* Instructions
************************************************************************************************/
function showInstruction(message) {
	document.getElementById("instruction").innerHTML = message;
	document.getElementById("instruction").style.display = "block";
    }
function hideInstruction() {
	document.getElementById("instruction").style.display = "none";
	}

/* Arrow Car Icon
************************************************************************************************/
function getCarMarker(start) {
	var car_icon = getArrowIcon(0.0);
	return new google.maps.Marker({
		position: start,
		icon: car_icon
		});
	}
function setCarMarkerImage(bearing) {
	carMarker.setIcon(getArrowUrl(bearing));
	}	
function getArrowIcon(bearing) {
	var icon = new google.maps.MarkerImage(getArrowUrl(bearing),
		new google.maps.Size(24, 24),
		new google.maps.Point(0,0),
		new google.maps.Point(12, 12));
	return icon;
    }   
function getArrowUrl(bearing) {
	var id = (3 * Math.round(bearing / 3)) % 120;
	return "http://maps.google.com/mapfiles/dir_" + id + ".png";
    }
    
/* Following functions based on those provided at:
* http://www.movable-type.co.uk/scripts/latlong.html
* Copyright 2002-2008 Chris Veness
*/

function getBearing(origin, destination) {
	if (origin.equals(destination)) {
		return null;
		}
	var lat1 = origin.lat().toRad();
	var lat2 = destination.lat().toRad();
	var dLon = (destination.lng()-origin.lng()).toRad();

	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) -
		Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	return Math.atan2(y, x).toBrng();
	}
    
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
	}

Number.prototype.toDeg = function() {
	return this * 180 / Math.PI;
	}

Number.prototype.toBrng = function() {
	return (this.toDeg()+360) % 360;
    }
    
function getHeadingDelta(a, b) {
	var d = Math.abs(sanitiseHeading(a) - sanitiseHeading(b));
	if (d > 180) {
		d = 360 - d;
		}
	return d;
    }

function sanitiseHeading(heading) {
	if (heading > 360 || heading < 360) {
		heading = heading % 360;
		}
	return heading;
    }
    
/**
* @param {google.maps.LatLng} newLatLng
* @returns {number}
* AKA I HATE YOU GOOGLE MAPS V3
*/
google.maps.LatLng.prototype.distanceFrom = function(newLatLng) {
	var lat1 = this.lat();
	var radianLat1 = lat1 * ( Math.PI  / 180 );
	var lng1 = this.lng();
	var radianLng1 = lng1 * ( Math.PI  / 180 );
	var lat2 = newLatLng.lat();
	var radianLat2 = lat2 * ( Math.PI  / 180 );
	var lng2 = newLatLng.lng();
	var radianLng2 = lng2 * ( Math.PI  / 180 );
	var earth_radius = 6378.1; // (km = 6378.1) OR (miles = 3959) - radius of the earth
	var diffLat =  ( radianLat1 - radianLat2 );
	var diffLng =  ( radianLng1 - radianLng2 );
	var sinLat = Math.sin( diffLat / 2  );
	var sinLng = Math.sin( diffLng / 2  ); 
	var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
	var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
	return distance;
	}