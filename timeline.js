var birthdate;
var year;

$(document).ready(function() {
	birthdate = $('.birthyear').html();
	
	year = birthdate;
	
	var arrowlength = (((2012 - birthdate) * 14) + 328)+'px';
	$('#timeline_arrow').css('width',arrowlength);	
	var startpos = '-'+(((birthdate - 1850) * 14))+'px';
	console.log(startpos);
	$('#timeline_lines').css('left',startpos);
	
	$("#timeline_lines").draggable({ 
		axis: 'x',
		drag: function(event, ui) { calcYear(ui.position.left) } 
		});
	
	updateYourTime();
	});
	
function calcYear(leftpos) {
	if (leftpos < 0) {
		rightpos = Math.abs(leftpos);
		var newyear = 1850 + Math.round(rightpos/14);
		if (newyear !== year) {
			year = newyear;
			updateYourTime(year);
			showEvents(year);
			}
		}
	}
	
function updateYourTime() {
	if (year < birthdate) {
		$('.yourtime').html('<strong>'+year+': '+(birthdate - year)+' BY</strong> (Before You)');
		}
	else if (year >= birthdate) {
		$('.yourtime').html('<strong>'+year+': '+(year - birthdate)+' AY</strong> (After You)');
		}
	}
	
function showEvents() {
	console.log(year);
	$('p.date').css('display','none');
	$("p[class*="+year+"]").css('display','block');
	}