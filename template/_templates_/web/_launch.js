[% divId = 'launchPane' %]

function show[%ucfirst(divId)%]() {
	statusMsg('Navigated to Main Portal');
	hideCurrentContentPane();
	$('#[%divId%]').fadeIn();
	currentContentPane = '[%divId%]';
	$(document).keypress(function(e) {
		//alert(e.which);
		switch (e.which) {
			case 103 : showSecurityGrants(); break;
			case 113 : showQuickGolfScore(); break;
			case 112 : showSecurityUser(); break;


		}
	});
	return '[%divId%]';
}
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

}


