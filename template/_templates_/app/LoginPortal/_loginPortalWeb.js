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
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
$(document).ready(function() {
	changePage(function() {showLoginPortal()});
});

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



