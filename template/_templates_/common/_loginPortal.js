//Begin LoginPortal
[% divId = 'LoginPortal' %]
[% spwfResource = 'security_user' %]

function loginCall(action) {
	var params = bindForm('[%divId%]Form');
	[%#prepParams will not work here %]
		params['spwfResource'] = 'security_user';
	params['spwfAction'] = action;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			var r = rslt.rows[0];
			if (r.session_id == '') {
				showDialog('Sorry, I Couldn\'t validate those Credentials');
				$('#password').val('');
			} else {
				statusMsg('Successfully Authenticated User : ' + r.user_id);
				usrSessionId = r.session_id;
				usrLoginId = r.user_id;
				onSuccessfulLogin();
				if (rslt.spwfAction == 'ONE_TIME') {
					var msg = 'You just completed a one time logon. ';
					msg += 'You password has not been changed, ';
					msg += 'please change your password for your next visit ';
					msg += 'if you have forgotten it. ';
					showDialog(msg);
				}
			}
		} else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	if (validate[%divId%]Form())serverCall(params, successf, FAILF);
}





function logOutUser() {
	usrSessionId = '';
	usrLoginId = '';
	$('#[%divId%]Form-user_id').val('');
	$('#[%divId%]Form-password').val('');
	displayMainLayout(false);
	$('#topMenuBar').hide();
	hideMainContent();
	return;
}


$(document).ready(function() {
	$('#[%divId%]Form-user_id').val('golfscore');
	$('#[%divId%]Form-password').val('golfscore');
});

function showLoginPortal() {
	$(document).keypress(function(e) {
		if (e.keyCode == 13) {//enter
			loginCall('authenticate');
		}
	});

}
function initPasswordReset() {
	var params = {};
	params['user_id'] = $('#[%divId%]Form-user_id').val();
	if (params['user_id'] == null || params['user_id'] == '') {
		showDialog('Please enter your User Id to initiate your password reset.');
		return false;
	}
	var successCallback = function(rslt) {
		if (rslt.success == 'true') {
			var msg = 'Your password reset is in process.  Do not close this page,';
			msg += 'but check your email for the code to enter to gain one-time ';
			msg += 'access in order to change your password.';
			showDialog(msg);
		}
		prepForOneTimeEntry();

	};
	$.ajax({type: 'POST',
		url: passwordResetUrlTarget,
		dataType: 'json',
		data: params,
		success: successCallback,
		error: FAILF
	});
}

function initForgottenUserName() {
	var msg = 'Please Enter your email address below.  ';
	msg += 'Instructions will be mailed to this address.  ';
	msg += '<br/><input type="text"';
	msg += ' style="width: 400px;" size="90" id="forgottenUserIdEmail"/><br/> ';
	showDialog(
			msg, '300', '600', true,
			{'Ok': function() {
													if ($('#forgottenUserIdEmail').val() != '') {
														emailUserName();
														$(this).dialog('close');
													}
												},
		'Cancel': function() {
			$(this).dialog('close');
		}
			}, 'Email User Name...');

}
//
function emailUserName() {
	var params = {};
	params['email_addr'] = $('#forgottenUserIdEmail').val();
	var successCallback = function(rslt) {
		if (rslt.success == 'true') {
			var msg = 'Your username has been mailed to your email address. ';
			msg += 'Do not close this page, but check your email for the username ';
			msg += ' and reset code to enter to gain one-time access. ';
			msg += ' You can change your password when you log in if desired';
			showDialog(msg);
		}
		prepForOneTimeEntry();
	};
	$.ajax({type: 'POST',
		url: passwordResetUrlTarget,
		dataType: 'json',
		data: params,
		success: successCallback,
		error: FAILF
	});
}

function prepForOneTimeEntry() {
	$('#[%divId%]Form-password_reset_codeDivId').show();
	$('#[%divId%]Form-passwordDivId').hide();
	$('#[%divId%]Form-password').val('');
	$('#cmdlogin').hide();
	$('#cmdOneTimelogin').show();

}

function onetimeLogin() {
	var params = {};
	params['user_id'] = $('#[%divId%]Form-user_id').val();
	params['password_reset_code'] =
		$('#[%divId%]Form-password_reset_code').val();
	if (params['user_id'] == null ||
			params['user_id'] == '' ||
			params['password_reset_code'] == null ||
			params['password_reset_code'] == '') {
				var msg = 'Please enter your User Id and Password';
				msg += 'Reset Code to initiate your password reset.';
				showDialog(msg);
				return false;
			}
	var successCallback = function(rslt) {
		if (rslt.success == 'true') {
			var msg = 'Your password reset is in process.  ';
			mst += 'Do not close this page, but check your email ';
			msg += 'for the code to enter to gain one-time access ';
			msg += 'in order to change your password.';
			showDialog(msg);
		}
		$('#[%divId%]Form-password_reset_codeDivId').show();
		$('#cmdlogin').hide();
		$('#cmdOneTimelogin').show();

	};
	$.ajax({type: 'POST', url: passwordResetUrlTarget,
		dataType: 'json', data: params,
		success: successCallback, error: FAILF
	});
}



