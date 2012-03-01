var map;
var pano;
var svClient;
var directions;
var directionsRoute;
var directionsDisplay;
var route;
var vertices;
var vertexMap;
var stepToVertex;
var stepMap;
var currentLatLng;
var panoMetaData;
var close = false;
var bearing;
var carHeading;
var nextBearing;
var nextVertexId;
var nextVertex;
var progressArray;
var progressDistance;
var currentStep;
var carMarker;
var selectedStep = null;
var driving = false;
var advanceTimer = null;
var advanceDelay = 1;
    
$(document).ready(function() {
	var start = new google.maps.LatLng(51.410543,-0.227559);
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
    
	carMarker = getCarMarker(start);
    carMarker.setMap(map);
    carMarker.setVisible(false);
       
	svClient = new google.maps.StreetViewService();
	pano = new google.maps.StreetViewPanorama(document.getElementById("streetview"));
	
	svClient.getPanoramaById(pano.getPano(), function(svData, svStatus) {
      	panoMetaData = svData;
      	moveCar();
      	});
	
	google.maps.event.addListener(pano, 'error', function(errorCode) {
        showStatus("The requested panorama could not be displayed");
  		});

    directions = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    directionsDisplay.setMap(map);
        
    generateRoute();
    });


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

function generateRoute() {
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	var request = {
		origin: from,
		destination: to,
    	travelMode: google.maps.TravelMode.DRIVING
  		};
	directions.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			directionsRoute = result;
			jumpInMyCar();
			}
		else {
			showStatus("Could not generate a route for the current start and end addresses");
			}
		});
    }

function jumpInMyCar() {
	/* Extract the one and only route from this response */
	route = directionsRoute.routes[0];
	/* Simplify the list of polyline vertices by removing duplicates */
	collapseVertices(route.overview_path);
	/* Center the map on the start of the route at street level */
    map.setCenter(vertices[0], 16);
	/* Begin checking the Street View coverage along this route */
	checkCoverage(0);
    }

function checkCoverage(step) {
	if (step > route.legs[0].steps.length) {
		console.log("coverage passed");
		} 
	else {
		if (step == route.legs[0].steps.length) {
			ll = route.legs[0].end_location;
			} 
		else {
			ll = route.legs[0].steps[step].lat_lngs[0];
			}

		svClient.getPanoramaByLocation(ll, 50, function(svData, svStatus) {
			if (svStatus == 'UNKNOWN_ERROR') {
				/* Server error, retry once per second */
				setTimeout("checkCoverage(" + step + ")", 1000);
				}
			else if (svStatus == 'ZERO_RESULTS') {
				/* Coverage check failed */
				showStatus("Street View coverage is not available for this route");
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

function jumpToVertex(idx) {
	currentLatLng = vertices[idx];
	nextVertex = vertices[idx + 1];
	nextVertexId = idx + 1;

	bearing = getBearingFromVertex(idx);
	nextBearing = getBearingFromVertex(idx + 1);

	setCarMarkerImage(bearing);
	carMarker.setPosition(currentLatLng);
    carMarker.setVisible(true);

	currentStep = stepMap[idx];
	constructProgressArray(idx);
	updateProgressBar(0);

	map.panTo(currentLatLng);
	map.setZoom(16);
	checkDistanceFromNextVertex();
	
	pano.setPosition(currentLatLng);
	pano.setPov({ heading: bearing, pitch: 0, zoom: 0 })

	svClient.getPanoramaByLocation(currentLatLng, 50, function(svData, svStatus) {
        if (svStatus == 'UNKNOWN_ERROR') {
			setTimeout("jumpToVertex(" + idx + ")", 1000);
			} 
		else if (svStatus == 'ZERO_RESULTS') {
			jumpToVertex(nextVertexId);
        	} 
        else {
			panoMetaData = svData;
			moveCar();
			}
		});
	}

function moveCar() {
	currentLatLng = pano.getPosition();
	carMarker.setPosition(currentLatLng);
	map.panTo(currentLatLng);

	svClient.getPanoramaByLocation(panoMetaData.location.latLng, function(svData, svStatus) {
        if (svStatus == 'UNKNOWN_ERROR') {
			setTimeout("moveCar()", 1000);
        	} 
        else if (svStatus == 'ZERO_RESULTS') {
			 jumpToVertex(nextVertexId);
        	} 
        else {
			panoMetaData.links = svData.links;
			checkDistanceFromNextVertex();
			if (driving) {
				advanceTimer = setTimeout("advance()", advanceDelay * 1000);
				}
			}
    	});
    }

function checkDistanceFromNextVertex() {
	close = false;
	var d = currentLatLng.distanceFrom(nextVertex);
	var b = getBearing(currentLatLng, nextVertex);
	if (getHeadingDelta(bearing, b) > 90) {
		incrementVertex();
		if (driving) {
			checkDistanceFromNextVertex();
        	}
		} 
	else {
		updateProgressBar(progressDistance - d);
		if (d < 10) {
			close = true;
			}
		}
    }

function advance() {
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
		var panAngle = getHeadingDelta(pano.getPov().heading, panoMetaData.links[selected.idx].heading);
		pano.setPov({ heading:panoMetaData.links[selected.idx].heading, pitch:0, zoom:0 });
		setTimeout(function() {
			// get pano closest to heading
			var nextpano;
			var anglediff = 1000;
			var panolinks = pano.getLinks()
			for (var i in panolinks) {
				var absdiff = Math.abs(panoMetaData.links[selected.idx].heading - panolinks[i].heading);
				if (absdiff < anglediff) {
					anglediff = absdiff;
					nextpano = panolinks[i].pano;
					} 
				}	
			pano.setPano(nextpano);
			}, panAngle * 10);
		}
	}

function selectLink(heading) {
	var Selected = new Object();

	for (var i = 0; i < panoMetaData.links.length; i++) {
		var d = getHeadingDelta(heading, panoMetaData.links[i].heading);
		if (Selected.delta == null || d < Selected.delta) {
			Selected.idx = i;
			Selected.delta = d;
			}
		}
		return Selected;
	}

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

		if (stepMap[nextVertexId - 1] == currentStep) {
			progressArray.push(nextVertex);
			} 
		else {
			currentStep = stepMap[nextVertexId - 1];
			highlightStep(currentStep);
			progressArray = [ currentLatLng, nextVertex ];
			updateProgressBar(0);
			}
		}
	}

function endReached() {
	stopDriving();
	updateProgressBar(0);
	showInstruction("The End");
	document.getElementById("step" + selectedStep).style.backgroundColor = "white";
	selectedStep = null;
	}

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

function constructProgressArray(vertexId) {
	progressArray = new Array();
	var stepStart = stepToVertex[currentStep];
	for (var i = stepToVertex[currentStep]; i <= vertexId + 1; i++) {
		progressArray.push(vertices[i]);
		}
    }

function updateProgressBar(progress) {
	progress = (progress < 0 ? 0 : progress);
	var stepLength = route.legs[0].steps[currentStep].distance.value;
	setProgressBarLength(1 - (progress / stepLength));
	}

function setProgressBarLength(progress) {
	var width = (496 * progress);
	if (width < 0) {
		width = 0;
		}
	document.getElementById("progressBar").style.width = width + "px";
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

function collapseVertices(path) {
	vertices = new Array();
	vertexMap = new Array(countVertices(path));

	vertices.push(path[0]);
	vertexMap[0] = 0;

	for (var i = 1; i < countVertices(path); i++) {
		if (! path[i].equals(vertices[vertices.length - 1])) {
			vertices.push(path[i]);
			}
		vertexMap[i] = vertices.length - 1;
		}
	stepToVertex = new Array(route.legs[0].steps.length);
	stepMap = new Array(vertices.length);

	for (var i = 0; i < route.legs[0].steps.length; i++) {
		stepToVertex[i] = vertexMap[route.legs[0].steps[i].path];
		}

	var step = 0;
	for (var i = 0; i < vertices.length; i++) {
		if (stepToVertex[step + 1] == i) {
			step++;
			}
		stepMap[i] = step;
		}
   }
   
function countVertices(path) {
	var num = 0;
	for (var vertex in path) {
		num++;
		}
	return num;
	}

function startDriving() {
	hideInstruction();
	document.getElementById("route").disabled = true;
	document.getElementById("stopgo").value = "Stop";
	document.getElementById("stopgo").setAttribute('onclick', 'stopDriving()'); 
	document.getElementById("stopgo").onclick = function() { stopDriving(); }
	driving = true;
	advance();
    }

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

function setSpeed() {
	advanceDelay = document.getElementById('speed').selectedIndex;
	}
	
function showInstruction(message) {
	document.getElementById("instruction").innerHTML = message;
	document.getElementById("instruction").style.display = "block";
    }

function hideInstruction() {
	document.getElementById("instruction").style.display = "none";
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