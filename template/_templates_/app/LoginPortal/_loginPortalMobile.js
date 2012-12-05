[% divId = 'LoginPortal' %]

[% SRC_LOC = '_loginPortalMobile.js'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function onSuccessfulLogin() {
	retrieveCache();
	showLaunchPane();
	if ($('#trustedDeviceId').value === 'on') {
		TRUSTED_DEVICE = true;
	} else {
		TRUSTED_DEVICE = false;
	}
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {boolean} validity.
*/
function validate[%ucfirst(divId)%]Form() {
  return true;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
$(document).ready(function() {
});


