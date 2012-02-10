<html>
<head>
<title>TIMELINEZZZZZ</title>
<link rel='stylesheet' type='text/css' media='screen' href='timeline_styles.css' />

<script src="jquery.min.js" type="text/javascript"></script>  
<script src="jquery-ui.min.js"></script>
<script type="text/javascript" src="timeline.js"></script>

</head>
<body>

<div id="querystring" style="display:none">
<span class="birthyear"><?=$_GET["birthyear"]?></span>
</div>

<div class="container">

<div id="timeline">

<img src="timeline_shadow.png" id="timeline_shadow" />
<img src="timeline_marker.png" id="timeline_marker" />
<div id="timeline_lines">
<img src="timeline_background.png" id="timeline_background" />
<div id="timeline_arrow"></div>
</div>

</div><!-- timeline -->

<p class="yourtime"></p>

<div id="dates">

<div id="telephone">
<p class="date 1860"><strong>1860:</strong> <a href="https://en.wikipedia.org/wiki/Johann_Philipp_Reis">Johann Philipp Reis</a> of Germany demonstrates a make-break transmitter with a knitting needle receiver. Witnesses said they heard human voices being transmitted: the first voice heard on a wire.</p>
<p class="date 1876"><strong>March 10th, 1876:</strong> Alexander Graham Bell calls his assistant Thomas Watson in the next room, and speaks the first words heard on the telephone: "Mr Watson&mdash;Come here&mdash;I want to see you".</p>
<p class="date 1926"><strong>March 7th 1926:</strong> The first transatlantic telephone call, from London to New York.</p>
</div>

<div id="radio">
<p class="date 1891"><strong>December 29th, 1891:</strong> United States grants a patent to Thomas Edison for "an electrostatic coupling system between elevated terminals".</p>
<p class="date 1900"><strong>June 3rd, 1900:</strong> Father Roberto Landell de Moura, a Brazilian Roman Catholic priest and inventor, publicly demonstrates a radio broadcast of the human voice.</p>
<p class="date 1920"><strong>August 31st, 1920:</strong> Detroit AM station 8MK broadcasts the first news bulletin. (<a href="http://www.wired.com/thisdayintech/2010/08/0831first-radio-news-broadcast/">Read more...</a>)</p>
<p class="date 1954"><strong>October 18th, 1954</strong>: Texas Instruments and Industrial Development Engineering Associates (IDEA) announce the first commercial transistor radio: the Regency TR-1. Employing the newly-developed transistor, it fit in the pocket and went on to sell about 150,000 units.</p>
</div>

<div id="television">
<p class="date 1925"><strong>October 2nd, 1925:</strong> John Logie Baird successfully transmits the first television picture: a greyscale image of the head of a ventriloquist's dummy nicknamed "Stooky Bill".</p>
<p class="date 1928"><strong>1928:</strong> First transatlantic broadcast.</p>
<p class="date 1936"><strong>1936:</strong> Regular BBCTV programming commences.</p>
<p class="date 1955"><strong>1955:</strong> ITV launches.</p>
<p class="date 1962"><strong>1963:</strong> First television pictures broadcast via satellite.</p>
<p class="date 1964"><strong>1964:</strong> BBC2 launches, and BBCTV is renamed BBC1.</p>
<p class="date 1984"><strong>1984:</strong> Channel 4 launches.</p>
</div>

<div id="internet">
<p class="date 1969"><strong>October 29th, 1969:</strong> The first computer-to-computer connection is made in what will become ARPANET, the predecessor to the internet.</p>
<p class="date 1982"><strong>March 1982:</strong> TCP/IP, the protocol that runs the internet, is standardised, paving the way for mass adoption.</p>
<p class="date 1990"><strong>25th December 1990:</strong> Tim Berners-Lee puts the first web page live, shortly followed by the first web server: <a href="http://info.cern.ch">http://info.cern.ch</a>.</p>
</div>

<div id="flickr">
<p class="date 2004"><strong>February 2004:</strong> Flickr launches, although the first photos were uploaded in December, 2003, including a <a href="http://www.flickr.com/photos/bees/74/">test image</a> and a photo of founder Caterina Fake's dog, <a href="http://www.flickr.com/photos/caterina/88/">Dos Pesos</a>.</p>
<p class="date 2011"><strong>2011</strong>: Flickr passes 6 billion uploaded photos, and 51 million registered users.</p>
</div>

<div id="facebook">
<p class="date 2004"><strong>February 4th, 2004:</strong> Mark Zuckerberg launches "thefacebook" at Harvard University. The first profile is, of course, <a href="www.facebook.com/profile.php?id=4">his own</a></p>
<p class="date 2012"><strong>2012</strong>: As of February 2012, Facebook has 845 million users worldwide.</p>
</div>

<div id="youtube">
<p class="date 2005"><strong>February 2005:</strong> Youtube launches from an office above a pizzeria and Japanese restaurant in San Mateo, California, founded by ex-Paypal employees Chad Hurley, Steve Chen, and Jawed Karim.</p>
<p class="date 2012"><strong>2012</strong>: By January 2012, Youtube is streaming 4 billion videos every day, and uploading more than 60 hours of new footage every minute.</p>
</div>

<div id="twitter">
<p class="date 2006"><strong>March 21st, 2006:</strong> Twitter co-founder Jack Dorsey posts the first tweet at 9:02pm: "<a href="https://twitter.com/#!/jack/status/29">inviting coworkers</a>".</p>
<p class="date 2010"><strong>January 22nd 2010:</strong>: Astronaut Timothy Creamer posts <a href="https://twitter.com/#!/Astro_TJ/status/8062317551">the first tweet from outer space</a>, from the International Space Station.</p>
<p class="date 2011"><strong>2011:</strong>: Twitter's 200 million users collectively post 140 million 140-character tweets every single day.</p>
</div>

</div><!-- dates -->


</div>

</body>
</html>