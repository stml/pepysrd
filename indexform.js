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
					for (var i = 0; i < item.address_components.length; i++) {
						if ( item.address_components[i].types[0] == 'country' ) {
							birthcountry = item.address_components[i].short_name;
							}
						}
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng(),
						birthcountry: birthcountry
						}
					}));
        		})
      		},
		change: function( event, ui ) {
            if ( !ui.item ) {
                $("#birthaddress").val('address');
            	}
            else {
				$('#birthlatitude').val(ui.item.latitude);
				$('#birthlongitude').val(ui.item.longitude); 
				$('#birthcountry').val(ui.item.birthcountry); 	
            	}
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
					for (var i = 0; i < item.address_components.length; i++) {
						if ( item.address_components[i].types[0] == 'country' ) {
							currentcountry = item.address_components[i].short_name;
							}
						}
					return {
						label:  item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng(),
						currentcountry: currentcountry
						}
					}));
        		})
      		},
		change: function( event, ui ) {
            if ( !ui.item ) {
                $("#currentaddress").val('address');
            	}
            else {
				$('#currentlatitude').val(ui.item.latitude);
				$('#currentlongitude').val(ui.item.longitude); 
				$('#currentcountry').val(ui.item.currentcountry); 	
            	}
     	 }
    	});   
    	
    // double-check those values are input
	$('#entryform').submit(function() {
		var birthvalue = $("#birthaddress").val();
		var currentvalue = $("#currentaddress").val();
		if (	birthvalue == 'address'
			||	birthvalue == ''
			|| 	currentvalue == 'address'
			|| 	currentvalue.val == '') {	
			alert('Hey! You need to fill in that form...')
	  		return false;
			}
		else {
			$('#entryform').submit();
			}
		});

  	});
  	}