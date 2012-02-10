var birthdate;
var year;

soundManager.url = 'swf/';

soundManager.onready(function() {
	soundManager.createSound({
		id: 'ping',
		url: 'mp3/ping.mp3',
		autoLoad: true,
		autoPlay: false,
		onload: function() {
			//console.log('The sound '+this.sID+' loaded!');
			},
		volume: 50
		});
	});

$(document).ready(function() {
	birthdate = $('.birthyear').html();
	if (birthdate > 2010) { birthdate = 2010; }
	if (birthdate < 1850) { birthdate = 1850; }
	
	year = birthdate;
	
	var arrowlength = (((2012 - birthdate) * 14) + 328)+'px';
	$('#timeline_arrow').css('width',arrowlength);	
	var startpos = '-'+(((birthdate - 1850) * 14))+'px';
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
	if (year == birthdate) {
		$('.yourtime').html('<strong>'+year+': Year Zero</strong> (for you)');
		}
	else if (year < birthdate) {
		$('.yourtime').html('<strong>'+year+': '+(birthdate - year)+' BY</strong> (Before You)');
		}
	else if (year > birthdate) {
		$('.yourtime').html('<strong>'+year+': '+(year - birthdate)+' AY</strong> (After You)');
		}
	}
	
function showEvents() {
	$('p.date').css('display','none');
	$("p[class*="+year+"]").css('display','block');
	if ($("p[class*="+year+"]").length > 0) { soundManager.play('ping') };
	}