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

<h3>Flickr Interesting Photos</h3>

<div class="flickrinteresting"></div>

<h3>Flickr Recent Photos</h3>

<div class="flickrrecent"></div>

<h3>Instagrams</h3>

<div class="instagrams"></div>

<h3>Foursquare Venues</h3>

<div class="foursquare"></div>

<script type="text/javascript">

function initialise() {
	var geocoder = new google.maps.Geocoder();
	var address = "<?=$_GET['postcode']?>";
	geocoder.geocode( { 'address': address, 'region': 'uk' }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
				
			var latitude = results[0].geometry.location.Qa;
			var longitude = results[0].geometry.location.Ra;
    		
    		var flickrapikey = 'c230daf9df2156f44962fffab28891e4';
    		var flickrapisecret = '56e0507daf1d321c';
    		var oneyearago = Math.round((new Date()).getTime() / 1000) - (365 * 24 * 60 * 60);
    		var flickrinterestingurl = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+flickrapikey+'&min_taken_date='+oneyearago+'&sort=interestingness-desc&has_geo=&lat='+latitude+'&lon='+longitude+'&radius=1&radius_units=km&per_page=10&format=json&nojsoncallback=1';
    		$.getJSON(flickrinterestingurl, function(fidata){
    			$.each(fidata.photos.photo, function(i,item){
        			var fisrc = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        			var filink = "http://www.flickr.com/photos/"+ item.owner +"/"+ item.id;
        			var ficomplete = '<a href="'+filink+'" target="_blank"><img src="'+fisrc+'" /></a> ';
        			$('.flickrinteresting').append(ficomplete);
				    });
				});
			var flickrrecenturl = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+flickrapikey+'&min_taken_date='+oneyearago+'&sort=date-posted-desc&has_geo=&lat='+latitude+'&lon='+longitude+'&radius=1&radius_units=km&per_page=10&format=json&nojsoncallback=1';
    		$.getJSON(flickrrecenturl, function(frdata){
    			$.each(frdata.photos.photo, function(i,item){
        			var frsrc = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        			var frlink = "http://www.flickr.com/photos/"+ item.owner +"/"+ item.id;
        			var frcomplete = '<a href="'+frlink+'" target="_blank"><img src="'+frsrc+'" /></a> ';
        			$('.flickrrecent').append(frcomplete);
				    });
				});
				
			var instagramid = '3fc84ba10dc74ec6a18290cb34a05fcd';
			var instagramsecret = 'd87b4b69cef54680a8eea17779aec6bc';
			var instagramcallback = 'http://shorttermmemoryloss.com/sandbox/pepysrd';
			var instagramurl = 'https://api.instagram.com/v1/media/search?lat='+latitude+'&lng='+longitude+'&client_id='+instagramid+'&distance=1000&callback=?';
    		$.getJSON(instagramurl, function(instadata){
    			$.each(instadata.data, function(i,item){
        			var instalink = item.link;
        			var instasrc = item.images.thumbnail.url;
        			var instacomplete = '<a href="'+instalink+'" target="_blank"><img src="'+instasrc+'" /></a> ';
        			$('.instagrams').append(instacomplete);
					});
				});	
				
			// 4sq test account: foursquaretest@shorttermmemoryloss.com
			var foursquareid = 'KYZBPNXV1A5OSFNQEHTIIXL5IGZMRYNIDAJOAJJLXFXBEDD0';
			var foursquaresecret = 'YZOBPCSZ113J4XANH55XJ52DN33JKPTPOTQYP1JXDITYXWDO';
			var foursquaresearchurl = 'https://api.foursquare.com/v2/venues/search?ll='+latitude+','+longitude+'&client_id='+foursquareid+'&client_secret='+foursquaresecret+'&v=20120104';
    		$.getJSON(foursquaresearchurl, function(fsqdata){
    			var foursquarelist = "<ul>"
    			$.each(fsqdata.response.venues, function(i,item){
        			foursquarelist = foursquarelist+'<li><a href="http://foursquare.com/venue/'+item.id+'">'+item.name+'</a>, ('+item.hereNow.count+' people here right now)</li>';
					});
				foursquarelist = foursquarelist+"</ul>";
				$('.foursquare').html(foursquarelist);
				});				
			
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