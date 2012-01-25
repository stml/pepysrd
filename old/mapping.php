<html>
<head>
<title>Pepys Rd Artyfacts</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles.css' />

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script>
<script type="text/javascript" src="http://tile.cloudmade.com/wml/latest/web-maps-lite.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>  
  
</head>
<body<? if ($_GET['postcode']) { echo ' onload="initialise()"'; } ?>>

<div class="container">

<? if($_GET['postcode']) { ?>

<h1>Pepys Rd, <?=$_GET['postcode']?></h1>

<? 
include('ops.php'); 
$ops = new Ops(); 
if ($ops->checkPostcode($_GET['postcode'])) { ?>

<h3>Google Static Maps</h3>

<p>
<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?=$_GET['postcode']?>&zoom=10&size=200x200&scale=1&maptype=terrain&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?=$_GET['postcode']?>&zoom=13&size=200x200&scale=1&maptype=roadmap&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?=$_GET['postcode']?>&zoom=16&size=200x200&scale=1&maptype=hybrid&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?=$_GET['postcode']?>&zoom=18&size=200x200&scale=1&maptype=satellite&sensor=false" />
</p>

<h3>Bing Static Maps</h3>

<div class="bingstaticmaps"></div>

<h3>OS Static Map (also Bing)</h3>

<div class="osstaticmaps"></div>

<h3>Google Slippy Maps</h3>

<div id="slippymaproad" style="width: 830px; height: 200px"></div>
<div id="slippymapsatt" style="width: 830px; height: 200px"></div>

<h3>Google Styled Slippy Map</h3>

<div id="styledslippymap" style="width: 830px; height: 200px"></div>

<h3>Static Street Views</h3>

<p>
<img src="http://maps.googleapis.com/maps/api/streetview?size=200x200&location=<?=$_GET['postcode']?>&fov=90&heading=0&pitch=10&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/streetview?size=200x200&location=<?=$_GET['postcode']?>&fov=90&heading=90&pitch=10&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/streetview?size=200x200&location=<?=$_GET['postcode']?>&fov=90&heading=180&pitch=10&sensor=false" />
<img src="http://maps.googleapis.com/maps/api/streetview?size=200x200&location=<?=$_GET['postcode']?>&fov=90&heading=270&pitch=10&sensor=false" />
</p>

<h3>Dynamic Street View</h3>

<div id="slippystreetview" style="width: 830px; height: 200px"></div>

<h3>Cloudmade Styled OpenStreetMaps</h3>

<div id="cmap1" style="width: 830px; height: 200px"></div>
<div id="cmap2" style="width: 830px; height: 200px"></div>
<div id="cmap3" style="width: 830px; height: 200px"></div>

<h3>Google Geocoding</h3>

<div class="geocoding"></div>

<script type="text/javascript">

function initialise() {
	var geocoder = new google.maps.Geocoder();
	var address = "<?=$_GET['postcode']?>";
	geocoder.geocode( { 'address': address, 'region': 'uk' }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			
			$('.geocoding').html('<pre>'+JSON.stringify(results, null, '    ')+'</pre>');
	
			var latitude = results[0].geometry.location.Pa;
			var longitude = results[0].geometry.location.Qa;
			
			var bingmapskey = 'Am8REQ4DCUx_KM2udiDD1YdMmx7wM-RYpLluqyO6dug4aUpCKNjIFC1Kv6vsXJxR';
			var centrepoint = latitude+','+longitude;
			var bingmapsurl1 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/CollinsBart/'+centrepoint+'/11?mapSize=200,200&key='+bingmapskey;
			var bingmapsurl2 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/Road/'+centrepoint+'/13?mapSize=200,200&key='+bingmapskey;
			var bingmapsurl3 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/AerialWithLabels/'+centrepoint+'/16?mapSize=200,200&key='+bingmapskey;
			var bingmapsurl4 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/Aerial/'+centrepoint+'/18?mapSize=200,200&key='+bingmapskey;
			$('.bingstaticmaps').html('<img src="'+bingmapsurl1+'" /> <img src="'+bingmapsurl2+'" /> <img src="'+bingmapsurl3+'" /> <img src="'+bingmapsurl4+'" />')
			
			var osmapsurl1 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/OrdnanceSurvey/'+centrepoint+'/11?mapSize=200,200&key='+bingmapskey;
			var osmapsurl2 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/OrdnanceSurvey/'+centrepoint+'/12?mapSize=200,200&key='+bingmapskey;
			var osmapsurl3 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/OrdnanceSurvey/'+centrepoint+'/13?mapSize=200,200&key='+bingmapskey;
			var osmapsurl4 = 'http://dev.virtualearth.net/REST/V1/Imagery/Map/OrdnanceSurvey/'+centrepoint+'/14?mapSize=200,200&key='+bingmapskey;
			$('.osstaticmaps').html('<img src="'+osmapsurl1+'" /> <img src="'+osmapsurl2+'" /> <img src="'+osmapsurl3+'" /> <img src="'+osmapsurl4+'" />')
			
			var gCentrepoint = new google.maps.LatLng(latitude,longitude);
			var roadmapOptions = {
				zoom: 14,
				center: gCentrepoint,
				mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			var satelliteOptions = {
				zoom: 14,
				center: gCentrepoint,
				mapTypeId: google.maps.MapTypeId.SATELLITE
				};
			var roadmap = new google.maps.Map(document.getElementById("slippymaproad"), roadmapOptions);
			var sattmap = new google.maps.Map(document.getElementById("slippymapsatt"), satelliteOptions);
			
			var styleArray = [
				{
					featureType: "all",
					stylers: [
						{ saturation: -80 }
						]
				},{
					featureType: "road.arterial",
					elementType: "geometry",
					stylers: [
						{ hue: "#00ffee" },
						{ saturation: 50 }
						]
				},{
					featureType: "poi.business",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
						]
				}
				];
			var styledslippymap = new google.maps.Map(document.getElementById("styledslippymap"), roadmapOptions);	
			styledslippymap.setOptions({styles: styleArray});
			
			var panoramaOptions = {
				position: gCentrepoint,
				pov: {
					heading: 0,
					pitch: 10,
					zoom: 0
  					}
				};
			var panorama = new google.maps.StreetViewPanorama(document.getElementById("slippystreetview"), panoramaOptions);
			
			var cloudmade1 = new CM.Tiles.CloudMade.Web({key: '855da5716ec7546aa596ec1c2c6b7d72', styleId: 998 });
			var cloudmade2 = new CM.Tiles.CloudMade.Web({key: '855da5716ec7546aa596ec1c2c6b7d72', styleId: 999 });
			var cloudmade3 = new CM.Tiles.CloudMade.Web({key: '855da5716ec7546aa596ec1c2c6b7d72', styleId: 9986 });
    		var cmap1 = new CM.Map('cmap1', cloudmade1);    		
    		var cmap2 = new CM.Map('cmap2', cloudmade2);    		
    		var cmap3 = new CM.Map('cmap3', cloudmade3);
    		cmCenter = new CM.LatLng(latitude, longitude);
    		cmap1.setCenter(cmCenter, 13);
    		cmap2.setCenter(cmCenter, 13);
    		cmap3.setCenter(cmCenter, 13);	
			
		} else {
			$('.geocoding').html("Unable to find address: " + status);
			}
		});
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