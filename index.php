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
   	
   	var birthaddress;
   	var currentaddress;
   	var birthcountry;
   	var currentcountry;

   	var birthaddressflag = false;
   	var currentaddressflag = false;
   	
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
					$('#birthlongitude').val(item.geometry.location.lng());
					birthaddress = item.formatted_address;
					for (var i = 0; i < item.address_components.length; i++) {
						if ( item.address_components[i].types[0] == 'country' ) {
							birthcountry = item.address_components[i].short_name;
							console.log(birthcountry);
							}
						}
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng(),
						}
					}));
        		})
      		},
      	select: function(event, ui) {
      		}
    	});

	$("#birthaddress").blur(function() {
  		$('#birthaddress').val(birthaddress);
  		birthaddressflag = true;
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
					currentaddress = item.formatted_address;
					for (var i = 0; i < item.address_components.length; i++) {
						if ( item.address_components[i].types[0] == 'country' ) {
							currentcountry = item.address_components[i].short_name;
							console.log(currentcountry);
							}
						}
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

	$("#currentaddress").blur(function() {
  		$('#currentaddress').val(currentaddress);
  		currentaddressflag = true;
		});
	
	$('#submitbutton').submit(function() {
	  	return false;
		});
	
	// double-check those values are input
	$("#submitbutton").click(function() {
		if (birthaddressflag && currentaddressflag) {
			$('#birthaddress').val(birthaddress);
			$('#currentaddress').val(currentaddress);	
			$('#entryform').submit();
			}
		else {
			alert('Hey! You need to fill in that form...')
	  		return false;
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

<form id="entryform" action="opening.php" method="post">
<p>I was born in <select id="birthyear" name="birthyear" /><? for ($i=2010;$i>1900;$i--) { echo '<option value="'.$i.'">'.$i.'</option>'; } ?></select> and grew up in <input type="text" id="birthaddress" name="birthaddress" value=" " />. Now I live in <input type="text" id="currentaddress" name="currentaddress" value=" " />.</p>
<input type="hidden" id="birthlatitude" name="birthlatitude" value="" />
<input type="hidden" id="birthlongitude" name="birthlongitude" value="" />
<input type="hidden" id="currentlatitude" name="currentlatitude" value="" />
<input type="hidden" id="currentlongitude" name="currentlongitude" value="" />
<input type="hidden" id="birthcountry" name="birthcountry" value="" />
<input type="hidden" id="currentcountry" name="currentcountry" value="" />

<p><input id="submitbutton" type="submit" value="Let's Go" /></p>
</form>

</div>

</body>
</html>