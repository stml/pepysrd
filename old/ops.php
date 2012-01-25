<?php 

class Ops {

// This function from http://www.braemoor.co.uk/software/postcodes.shtml
function checkPostcode (&$toCheck) {
	// Permitted letters depend upon their position in the postcode.
	$alpha1 = "[abcdefghijklmnoprstuwyz]";	                        // Character 1
	$alpha2 = "[abcdefghklmnopqrstuvwxy]";                          // Character 2
	$alpha3 = "[abcdefghjkpmnrstuvwxy]";                            // Character 3
	$alpha4 = "[abehmnprvwxy]";                                     // Character 4
	$alpha5 = "[abdefghjlnpqrstuwxyz]";                             // Character 5	
	// Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA with a space
	$pcexp[0] = '/^('.$alpha1.'{1}'.$alpha2.'{0,1}[0-9]{1,2})([[:space:]]{0,})([0-9]{1}'.$alpha5.'{2})$/';
	// Expression for postcodes: ANA NAA
	$pcexp[1] =  '/^('.$alpha1.'{1}[0-9]{1}'.$alpha3.'{1})([[:space:]]{0,})([0-9]{1}'.$alpha5.'{2})$/';
	// Expression for postcodes: AANA NAA
	$pcexp[2] =  '/^('.$alpha1.'{1}'.$alpha2.'{1}[0-9]{1}'.$alpha4.')([[:space:]]{0,})([0-9]{1}'.$alpha5.'{2})$/';
	// Exception for the special postcode GIR 0AA
	$pcexp[3] =  '/^(gir)([[:space:]]{0,})(0aa)$/';
	// Standard BFPO numbers
	$pcexp[4] = '/^(bfpo)([[:space:]]{0,})([0-9]{1,4})$/';
	// c/o BFPO numbers
	$pcexp[5] = '/^(bfpo)([[:space:]]{0,})(c\/o([[:space:]]{0,})[0-9]{1,3})$/';
	// Overseas Territories
	$pcexp[6] = '/^([a-z]{4})([[:space:]]{0,})(1zz)$/';	
	// Anquilla
	$pcexp[7] = '/^ai-2640$/';
	// Load up the string to check, converting into lowercase
	$postcode = strtolower($toCheck);
	// Assume we are not going to find a valid postcode
	$valid = false;
	// Check the string against the six types of postcodes
	foreach ($pcexp as $regexp) {
		if (preg_match($regexp,$postcode, $matches)) {		
			// Load new postcode back into the form element  
			$postcode = strtoupper ($matches[1] . ' ' . $matches [3]);		
			// Take account of the special BFPO c/o format
			$postcode = preg_replace ('/C\/O([[:space:]]{0,})/', 'c/o ', $postcode);    
			// Take acount of special Anquilla postcode format (a pain, but that's the way it is)
			if (preg_match($pcexp[7],strtolower($toCheck), $matches)) $postcode = 'AI-2640';      
			// Remember that we have found that the code is valid and break from loop
			$valid = true;
			break;
			}
		}
	// Return with the reformatted valid postcode in uppercase if the postcode was 
	// valid
	if ($valid){
		$toCheck = $postcode; 
		return true;
		} 
	else return false;
	}
	
}

?>