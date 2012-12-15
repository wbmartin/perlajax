
[% divId = 'launchPane' %]
[% SRC_LOC = '_LaunchWeb'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {string} divid.
*/
function show[%ucfirst(divId)%]() {
	standardShowContentPane('[%divId%]', 'Main Portal');
	$(document).keypress(function(e) {
		switch (e.which) {
			case 103 : showSecurityGrants(); break;
			case 113 : showQuickGolfScore(); break;
			case 112 : showSecurityUser(); break;
		}
	});
	return '[%divId%]';
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function imposeLauncherSecurityUIRestrictions() {
	var divIdToSecure;
	divIdToSecure = '#launcherShowSecurityUserSpanId';
	(isUserAuthorized('SELECT_SECURITY_USER')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#launcherShowViewAveragesSpanId';
	(isUserAuthorized('SELECT_GOLFER_HANDICAP')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#launcherShowQuickEntrySpanId';
	(isUserAuthorized('SELECT_GOLF_SCORE')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#launcherShowGrantsSpanId';
	(isUserAuthorized('SELECT_SECURITY_PROFILE')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);
	divIdToSecure = '#launcherShowGolfersSpanId';
	(isUserAuthorized('SELECT_GOLFER')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

}


