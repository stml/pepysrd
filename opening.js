var birthfulladdress;
var currentfulladdress;
var birthshortaddress;
var currentshortaddress;

var birthcountry;
var currentcountry;

var birthyear;

var birthlifeexpectancy = 0;
var currentlifeexpectancy = 0;

var birthincome = 0;
var currentincome = 0;

var birthlatitude;
var birthlongitude;
var currentlatitude;
var currentlongitude;

// ONS area codes for locations
var birthONS;
var currentONS;
var birthMLSOA;
var currentMLSOA;

var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;


$(document).ready(function() {
	
	birthyear = $('.birthyear').html();

	birthfulladdress = $('.birthfulladdress').html();
	currentfulladdress = $('.currentfulladdress').html();
	birthshortaddress = birthfulladdress.split(",")[0];
	currentshortaddress = currentfulladdress.split(",")[0]; 

	birthcountry = $('.birthcountry').html();
	currentcountry = $('.currentcountry').html();
	
	birthlatitude = $('.birthlatitude').html();
	birthlongitude = $('.birthlongitude').html();
	currentlatitude = $('.currentlatitude').html();
	currentlongitude = $('.currentlongitude').html();
	
	$('h3#yearsdistance').html('In '+(2012-birthyear)+' years, you\'ve gone from '+birthshortaddress+' to '+currentshortaddress+'.');
	console.log(birthcountry,currentcountry);
	
	if (birthcountry == 'GB' && currentcountry =='GB') {
  		initialize();
  		}
  	else {
  		internationalise();
  		}
	});
	
function initialize() {

	// SET THE MAP
	directionsDisplay = new google.maps.DirectionsRenderer();
    var navel = new google.maps.LatLng(0,0);
    var myOptions = {
		zoom:7,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: navel
		}
	map = new google.maps.Map(document.getElementById("directions_map"), myOptions);
    directionsDisplay.setMap(map);
    
    // Add route and distances
    calcRoute();
    
    // DO HOUSE PRICES STUFF
    setHousePrices();
    
    // DO stuff than requires ONS details
    getONS();

	// set map backgrounds   	
   	var birthplacebackground = "url('http://maps.googleapis.com/maps/api/staticmap?center="+birthfulladdress+"&zoom=14&size=330x330&maptype=satellite&sensor=false')";
   	$('#birthplace').css('background-image', birthplacebackground );
   	$('.birthshortaddress').text(birthshortaddress);
   	var currentplacebackground = "url('http://maps.googleapis.com/maps/api/staticmap?center="+currentfulladdress+"&zoom=14&size=330x330&maptype=satellite&sensor=false')";	
   	$('#currentplace').css('background-image', currentplacebackground );  
   	$('.currentshortaddress').text(currentshortaddress);
   	
  	}

//Get four-digit ONS area code
function getONS() {
	// Mapit API (NB: lon, lat order)
	var birthmapiturl = 'http://mapit.mysociety.org/point/4326/'+birthlongitude+','+birthlatitude;
	var currentmapiturl = 'http://mapit.mysociety.org/point/4326/'+currentlongitude+','+currentlatitude;	
	$.getJSON(birthmapiturl, function(data) {
    	$.each(data, function(key,val) {
    		$.each(val.codes, function(key,val) {
    			if (key == 'ons' && val.length == 4) { birthONS = val; }
  				});
			});
		$.getJSON(currentmapiturl, function(data) {
    		$.each(data, function(key,val) {
    			$.each(val.codes, function(key,val) {
    				if (key == 'ons' && val.length == 4) { currentONS = val; }
  					});
				});
				console.log(birthONS,currentONS);
			getLifeData(birthONS,currentONS);
			});
		});
	}
	
function getLifeData(birthONS,currentONS) {
    $.ajax({
        type: "GET",
        url: "IncomeLifeExFinal.csv",
        dataType: "text",
        success: function(data) {
        	var lines = data.split(/\r\n|\n/);
			for (var i=0; i<lines.length; i++) {
        		var data = lines[i].split(',');
        		if (data[2] == birthONS) {
        			birthlifeexpectancy = data[3];
        			birthincome = data[4];
        			}
        		if (data[2] == currentONS) {
        			currentlifeexpectancy = data[3];
        			currentincome = data[4];
        			}
				}
			// insert nationwide averages if above fails
			if (birthlifeexpectancy == 0) { birthlifeexpectancy = 80.3; }
			if (currentlifeexpectancy == 0) { currentlifeexpectancy = 80.3 ; }
			if (birthincome == 0) { birthincome = 26565.65; }
			if (currentincome == 0) { currentincome = 26565.65; }
			
			$('#birthplace > ul').append('<li id="birthlifeexpectancy">Average Life Expectancy: '+birthlifeexpectancy+' years</li>');
			$('#currentplace > ul').append('<li id="currentlifeexpectancy">Average Life Expectancy: '+currentlifeexpectancy+' years</li>');
			
			$('#birthplace > ul').append('<li id="birthincome">Average Annual Income: &pound;'+birthincome+'</li>');
			$('#currentplace > ul').append('<li id="currentincome">Average Annual Income: &pound;'+currentincome+'</li>');
			
			if (birthlifeexpectancy > currentlifeexpectancy) {
				var lifeexpectancydifference = Math.round((birthlifeexpectancy - currentlifeexpectancy)*100) / 100;
				$('#lifeexpectancydifference').html('Your life expectancy is '+lifeexpectancydifference+' years shorter.');
				}
			else if (birthlifeexpectancy < currentlifeexpectancy) {
				var lifeexpectancydifference = Math.round((currentlifeexpectancy - birthlifeexpectancy)*100) / 100;
				$('#lifeexpectancydifference').html('You\'ll live '+lifeexpectancydifference+' years longer.');
				}
				
			var incomedifference = currentincome - birthincome;
			if (incomedifference > 0) {
				var incomedifference = Math.round((currentincome - birthincome)*100) / 100;
				$('#incomedifference').html('Your average income is &pound;'+incomedifference+' more a year.');
				}
			if (incomedifference < 0) {
				var incomedifference = Math.round((birthincome - currentincome)*100) / 100;
				$('#incomedifference').html('Your average income is &pound;'+Math.abs(incomedifference)+' less a year.');
				}
				
			// make the incomenumbers tidy with commas
   			$('#incomedifference').text($('#incomedifference').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
   			$('#birthincome').text($('#birthincome').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
   			$('#currentincome').text($('#currentincome').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
			}
     	});
	}
	  
function calcRoute() {
	var request = {
		origin: birthfulladdress, 
		destination: currentfulladdress,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			var legs = response.routes[0].legs;
			var totalDistance = 0;
			for(i in legs) {
				totalDistance = totalDistance + legs[i].distance.value;
				}
			totalDistanceInMiles = Math.round(totalDistance * 0.000621371192);
			$('#distance').text('That\s a distance of '+totalDistanceInMiles+' miles.');
			}
    	});
  	}

function setHousePrices() {
    var birthplaceurl = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=metadata&place_name='+birthshortaddress+'&encoding=json&callback=?';
    var currentplaceurl = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=metadata&place_name='+currentshortaddress+'&encoding=json&callback=?';
    var birthplaceaverageprice;
    var currentplaceaverageprice;
    $.getJSON(birthplaceurl, function(bpdata) {
		var mostrecentmonth = bpdata.response.most_recent_month;
		$.each(bpdata.response.metadata, function(i, val) {
			if (val.metadata_name == 'avg_property_buy_monthly') {
				birthplaceaverageprice = val.data[mostrecentmonth].avg_price;
	 			$.getJSON(currentplaceurl, function(currentdata) {
					var mostrecentmonth2 = currentdata.response.most_recent_month;
					$.each(currentdata.response.metadata, function(j, val2) {
						if (val2.metadata_name == 'avg_property_buy_monthly') {
							currentplaceaverageprice = val2.data[mostrecentmonth2].avg_price;
							$('#birthplace > ul').append('<li id="birthhouseprice">Average House Price: &pound;'+birthplaceaverageprice+'</li>');
							$('#currentplace > ul').append('<li id="currenthouseprice">Average House Price: &pound;'+currentplaceaverageprice+'</li>');
							if (birthplaceaverageprice > currentplaceaverageprice) {
								$('#housepricedifference').html('(If you own a house, it\'s worth &pound;'+Math.round(birthplaceaverageprice-currentplaceaverageprice)+' less too.)');							}
							else {
								$('#housepricedifference').html('(If you own a house, it\'s worth &pound;'+Math.round(currentplaceaverageprice-birthplaceaverageprice)+' more too.)');
								}							   		
   	// make the house price numbers tidy with commas
   	$('#housepricedifference').text($('#housepricedifference').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
   	$('#birthhouseprice').text($('#birthhouseprice').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
   	$('#currenthouseprice').text($('#currenthouseprice').text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
							}
						});
   					});
				}
			});
   		});
   	}