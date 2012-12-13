[% divId = 'LoginPortal' %]
[% spwfResource = 'security_user' %]
[% SRC_LOC = '_loginPortalWeb.js'%]

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function onSuccessfulLogin() {
	$('#password').val('');
	displayMainLayout(true);
	$('#topMenuBar').show();
	registerAction();
	timeoutIfNoAction();
	changePage(function() {showLaunchPane()});
	retrieveCache();
	if ($('#trustedDeviceId').prop('checked')) {
		TRUSTED_DEVICE = true;
	} else {
		TRUSTED_DEVICE = false;
	}

}
/**
*
* SRC: [%SRC_LOC%]
* =====================================================================
* @return {boolean}  validity. 
*/
function validate[%divId%]Form() {
	var formValid = standardValidate('[%divId%]Form');
	return formValid;
}



