[% divId = 'LoginPortal' %]
[% spwfResource = 'security_user' %]


function onSuccessfulLogin() {
	$('#password').val('');
	displayMainLayout(true);
	$('#topMenuBar').show();
	registerAction();
	timeoutIfNoAction();
	changePage(function() {showLaunchPane()});
	retrieveCache();
}

$(document).ready(function() {
	changePage(function() {showLoginPortal()});
});

function validate[%divId%]Form() {
	var formValid = standardValidate('[%divId%]Form');
	return formValid;
}



