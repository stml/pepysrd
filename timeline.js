var birthdate;

$(document).ready(function() {
	birthdate = $('.birthyear').html();
	updateYourTime('1850');
	});
	
function updateYourTime(year) {
	if (year < birthdate) {
		$('.yourtime').html('<strong>'+(birthdate - year)+' BY</strong> (Before You)');
		}
	else if (year >= birthdate) {
		$('.yourtime').html('<strong>'+(year - birthdate)+' AY</strong> (After You)');
		}
	}