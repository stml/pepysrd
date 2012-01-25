<html>
<head>
<title>Pepys Rd : Hello</title>
<link rel='stylesheet' type='text/css' media='screen' href='styles2.css' />

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDgGTKsngvpw0m6KOhsAgHYOeKFdFNzVOs&sensor=false"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>

<script type="text/javascript">
var geocoder;

$(document).ready(function() {  
	$("#birthyear").val("year");
	$("#birthyear").focus(function() {
		$(this).val('');
		});
	$("#currentaddress").val("address");
	$("#currentaddress").focus(function() {
		$(this).val('');
		});
	$("#birthaddress").val("address"); 
	$("#birthaddress").focus(function() {
		$(this).val('');
		}); 
	
  	initialize();
	});
function initialize(){
	geocoder = new google.maps.Geocoder();
	var ne = new google.maps.LatLng(59.44507, 3.86718);
   	var sw = new google.maps.LatLng(48.10743, -13.18359);
	$(function() {
	$("#birthaddress").autocomplete({
		source: function(request, response) {
			geocoder.geocode( {
				'address': request.term, 
				'region': 'UK',
      			'bounds':  new google.maps.LatLngBounds(sw, ne)
				}, 
				function(results, status) {
				response($.map(results, function(item) {
					$('#birthlatitude').val(item.geometry.location.lat());
					console.log(item.geometry.location.lat(),item.geometry.location.lng())
					$('#birthlongitude').val(item.geometry.location.lng());
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
						}
					}));
        		})
      		},
      	select: function(event, ui) {
      		}
    	});
	$("#currentaddress").autocomplete({
		source: function(request, response) {
			geocoder.geocode( {
				'address': request.term, 
				'region': 'UK',
      			'bounds':  new google.maps.LatLngBounds(sw, ne)
				}, 
				function(results, status) {
				response($.map(results, function(item) {
					$('#currentlatitude').val(item.geometry.location.lat());
					$('#currentlongitude').val(item.geometry.location.lng());
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
						}
					}));
        		})
      		},
      	select: function(event, ui) {
      		}
    	});

  	});
  	}
</script>

</head>
<body>

<div class="container">

<div class="sign"><h1>PEPYSRD.COM</h1> <span class="green">SW6</span> <span class="red">CITY OF SOMEWHERE</span></div>

<p><em>(Something encouraging...)</em></p>

<form action="/sandbox/pepysrd/opening.php" method="post">
<p>I was born in <input id="birthyear" type="text" name="birthyear" value=" " /> and grew up in <input type="text" id="birthaddress" name="birthaddress" value=" " />. Now I live in <input type="text" id="currentaddress" name="currentaddress" value=" " /></p>
<input type="hidden" id="birthlatitude" name="birthlatitude" value="" />
<input type="hidden" id="birthlongitude" name="birthlongitude" value="" />
<input type="hidden" id="currentlatitude" name="currentlatitude" value="" />
<input type="hidden" id="currentlongitude" name="currentlongitude" value="" />

<p><input type="submit" value="Wut?" /></p>
</form>

</div>

</body>
</html>