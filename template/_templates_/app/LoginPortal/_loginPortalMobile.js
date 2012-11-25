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
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function validate[%ucfirst(divId)%]Form() {
  return true;
}


