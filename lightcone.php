<html>
<head>
<title>Light Cone</title>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>  
<script src="jquery.backstretch.min.js" type="text/javascript"></script>
<script src="lightcone.js" type="text/javascript"></script>
<style type="text/css">
	* { margin: 0; padding: 0; }
	body { width: 100%; height: 100%; text-align: center; }
	#info { font-size: 150%; width: 650px; background: #000; color: #fff; padding: 25px; margin: 200px auto 25px; }
	#credit { font-size: 65%; width: 650px; background: #000; color: #fff; padding: 25px; margin: 0 auto; }
	a { text-decoration: underline; color: #fff; }
</style>
</head>
<body>
<div id="querystring" style="display:none">
<span class="birthmonth"><?=$_GET["birthmonth"]?></span>
<span class="birthyear"><?=$_GET["birthyear"]?></span>
</div>
<div id="info" class="ll"></div>

<div id="credit">Original <a href="http://www.interconnected.org/home/more/lightcone/">Lightcone concept</a> by Matt Webb | Star data by <a href="http://solstation.com/stars3/100-gs.htm">Solstation</a></div>

</body>
</html>