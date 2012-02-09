$(document).ready(function() {
	
	var startyear = 2004;
	var endyear = 2011;
	var numyears = endyear - startyear;
	var startvalue = 0;
	var endvalue = 600000000;
	var values = [];
	for (var i=0; i<=numyears; i++) {
		values.push( ((i/numyears) * (endvalue - startvalue)) + startvalue );
		}
	console.log(values);
    $('.dynamicsparkline').sparkline(values, { type:'bar', barColor:'green', height: '50px', barWidth: '20' });
	});