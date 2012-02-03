var birthmonth;
var birthyear;
var laststar_name;
var nextstar_name;
var laststar_distance;
var nextstar_distance;
var laststar_constellation;
var nextstar_constellation;
var elapsedtime;

$(document).ready(function() {
	$.backstretch("starfield.png", {speed: 10});
	var birthmonth = $('.birthmonth').html();
	var birthyear = $('.birthyear').html();
	
	var birthdate = new Date("1/"+birthmonth+"/"+birthyear); 
	var currentdate = new Date();
	var one_year=1000*60*60*24*365;
	elapsedtime = Math.round(100 * ((currentdate.getTime() - birthdate.getTime()) / one_year)) / 100;
	
	$.ajax({
        type: "GET",
        url: "Stars.csv",
        dataType: "text",
        success: function(data) {
        	var lines = data.split(/\r\n|\n/);
        	var line = 0;
			for (var i=0; i<lines.length; i++) {
        		var data = lines[i].split(',');
        		if (data[0] < elapsedtime) {
        			line = i;
        			}
				}
			var lastline = lines[line-1].split(',');
			var nextline = lines[line].split(',');
			laststar_distance = lastline[0];
			nextstar_distance = nextline[0];
			laststar_name = lastline[1];
			nextstar_name = nextline[1];
			laststar_constellation = lastline[2];
			nextstar_constellation = nextline[2];	
			nextstar_time = 		
			$('#info').html('Your personal light cone, which left Earth '+elapsedtime+' years ago, passed the star '+laststar_name+', '+laststar_distance+' light years away in the constellation '+laststar_constellation+', '+(Math.round((elapsedtime - laststar_distance) * 100)/100)+' years ago.<br><br>Your light cone will reach '+nextstar_name+', '+nextstar_distance+' light years away in the constellation '+nextstar_constellation+', in '+(Math.round((elapsedtime-nextstar_distance) * 100)/100)+' years time.');
        	}
        });
	
	});
	
