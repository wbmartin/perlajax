'use strict';
    var urlTarget = 'cgi-bin/server.pl';
    var passwordResetUrlTarget = 'cgi-bin/pwdreset.pl';
    var VIEW_ID = 0;
    var PAGE_CALLS = new Array();



//header1.js
//shared variables
var usrSessionId = '';
var usrLoginId = '';
var usrLastAction = new Date();
var usrLogoutScheduled = false;
var usrTimeOutDuration = 20 * 60 * 1000;
var clientLog = new Array();
var insertUpdateChoose = 'INSERTUPDATE';
var FAILF = function() {alert('FAIL');};
var currentContentPane = '';
var SERVER_SIDE_FAIL = 'serverSideFail';
var OUTSTANDING_SERVER_CALLS = 0;
var PAGINATION_ROW_LIMIT = 10;
var CURRENT_PAGE = '';

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Form Functions
function appendValidationMsg(formId, fieldId, msg) {
	var fullyQName = 'form#' + formId + ' #' + fieldId;
	if ($('form#' + formId + ' #' + fieldId + 'Error').length == 0) {
		var tmpSpan = '<span id = "' + fieldId;
	 	tmpSpan += 'Error" class = "ValidationMsg"></span>';
		$(fullyQName).after(tmpSpan);
	}
	if ($(fullyQName + 'Error').html().length == 0) {
		$(fullyQName + 'Error').append('*');
	}
	$(fullyQName + 'Error').append(' ' + msg);
	$(fullyQName).addClass('invalid');
}

function highlightFieldError(formId, fieldId, yesNo) {
	var bordercolor = 'black';
	if (yesNo) bordercolor = 'red';
		$('form#' + formId + ' #' + fieldId).css('border-color:' + bordercolor);

}

function bindForm(formName) {
	var rslt = {};
	var fieldId = '';
	$.each($('form#' + formName + ' :input'),
			function(key, field) {
				fieldId = field.id.replace(formName + '-', '');
				if (field.type != 'button') rslt[fieldId] = field.value;
			});
	return rslt;
}

function bindToForm(formName, obj) {
	var fieldId = '';
	$.each($('form#' + formName + ' :input'),
			function(key, field) {
				fieldId = field.id.replace(formName + '-', '');
				if (field.type != 'button') field.value = obj[fieldId];
			});
}

function clearForm(formName) {
	var fieldId = '';
	$.each($('form#' + formName + ' :input'),
			function(key, field) {
				fieldId = field.id.replace(formName + '-', '');
				if (field.type == 'checkbox') {
					field.checked = false;
				} else if (field.type != 'button') field.value = '';
			}
			);
	toggleSaveMode(formName, false);
}

function toggleSaveMode(formName, saveMode) {
	var buttonToShow = (saveMode) ? 'Save' : 'Add';
	var buttonToHide = (!saveMode) ? 'Save' : 'Add';
	var id = 'form#' + formName + ' #' + formName + buttonToHide;
	$(id).addClass('LogicDisabled');
	id = 'form#' + formName + ' #' + formName + buttonToShow;
	$(id).removeClass('LogicDisabled');
}

function standardValidate(formName) {
	var formValid = true;
	if ($('#' + formName).length == 0) formValid = false;
	$.each($('form#' + formName + ' span.ValidationMsg'), function(ndx, span) {
		span.innerHTML = '';
	});
	$.each($('form#' + formName + ' .invalid'), function(ndx, field) {
		$('form#' + formName + ' #' + field.id).removeClass('invalid');
	});
	$.each($('form#' + formName + ' .VALIDATErequired'), function(ndx, field) {
		if (field.value == null || field.value == '') {
			appendValidationMsg(formName, field.id, 'Required');
			highlightFieldError(formName, field.id, true);
			formValid = false;
		}
	});
	$.each($('form#' + formName + ' .VALIDATEinteger'), function(ndx, field) {
		if (field.value != null && !isInteger(field.value)) {
			appendValidationMsg(formName, field.id, 'Integer Input Required');
			highlightFieldError(formName, field.id, true);
			formValid = false;
		}
	});
	$.each($('form#' + formName + ' .VALIDATEmmddyyyydate'),
			function(ndx, field) {
				if (field.value != null && !field.value.match(/\d\d\/\d\d\/\d\d\d\d/)) {
					appendValidationMsg(formName, field.id, 'MM/DD/YYYY Required');
					highlightFieldError(formName, field.id, true);
					formValid = false;
				}
	});
	return formValid;
}

function isFieldIdEmpty(fieldId_) {
	if (document.getElementById(fieldId_) == undefined) return true;
	if (document.getElementById(fieldId_).value == undefined) return true;
	if (document.getElementById(fieldId_).value == null) return true;
	if (document.getElementById(fieldId_).value == '') return true;
	return false;
}

function isEmpty(val) {
	if (typeof(val) == 'undefined') return true;
	if (val == null || val == '') return true;
	return false;
}

function isInteger(value) {
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Formatting Functions
function pgDate(val) {
	var rslt;
	if (val != null) {
		rslt = val.substring(5, 7) + '/';
	  rslt += val.substring(8, 10) + '/' + val.substring(0, 4);
	} else {
		rslt = '';
	}
	return rslt;
}

function formatNumber(num, decimalNum, bolLeadingZero, bolParens, bolCommas) {
	if (isNaN(parseInt(num))) return '---';
	var tmpNum = num;
	var iSign = num < 0 ? -1 : 1;		// Get sign of number
	tmpNum *= Math.pow(10, decimalNum);
	tmpNum = Math.round(Math.abs(tmpNum));
	tmpNum /= Math.pow(10, decimalNum);
	tmpNum *= iSign;
	var tmpNumStr = new String(tmpNum);

	// See if we need to strip out the leading zero or not.
	if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
		if (num > 0) tmpNumStr = tmpNumStr.substring(1, tmpNumStr.length);
		else tmpNumStr = '-' + tmpNumStr.substring(2, tmpNumStr.length);

	// See if we need to put in the commas
	if (bolCommas && (num >= 1000 || num <= -1000)) {
		var iStart = tmpNumStr.indexOf('.');
		if (iStart < 0) iStart = tmpNumStr.length;

		iStart -= 3;
		while (iStart >= 1) {
			tmpNumStr = tmpNumStr.substring(0, iStart) + ',' + tmpNumStr.substring(iStart, tmpNumStr.length);
				iStart -= 3;
		}
	}

	// See if we need to use parenthesis
	if (bolParens && num < 0) {
	 	tmpNumStr = '(' + tmpNumStr.substring(1, tmpNumStr.length) + ')';
	}

	if (tmpNumStr.indexOf('.') < 0 && decimalNum > 0) {
		tmpNumStr += '.';
	}
	while ((tmpNumStr.length - tmpNumStr.indexOf('.')) <= decimalNum) {
		tmpNumStr += '0';

	}

	return tmpNumStr.toString();		// Return our formatted string!
}


String.prototype.ucfirst = function() {
	// Split the string into words if string contains multiple words.
	var x = this.split(/\s+/g);
	for (var i = 0; i < x.length; i++) {
		// Splits the word into two parts. One part being the first letter,
		// second being the rest of the word.
		var parts = x[i].match(/(\w)(\w*)/);
		// Put it back together but uppercase the first letter and
		x[i] = parts[1].toUpperCase() + parts[2];
	}
	// Rejoin the string and return.
	return x.join(' ');
};



//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//js Utility Functions
function filterCacheArrayByVal(cacheArray, idToSet) {
	for (var i = 0; i < cacheArray.length; i++) {
		if (cacheArray[i].val == idToSet)return cacheArray[i];
	}
	return {};
}

function digest(er, ee) {
	if (null == ee ||
			'object' != typeof ee ||
			null == er ||
			'object' != typeof er) return er;
	for (var attr in ee) {
		er[attr] = ee[attr];
	}
	return er;
}


function deepCopy(obj) {
	return $.extend(true, [], obj);
}

function setSelectOptions(selectId, obj) {
	var newhtml = '<option value=""></option>';
	$.each(obj, function(key, val) {
		newhtml += '<option value="' + key + '">' + val + '</option>';
	});
	$(selectId).html(newhtml);

}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Content Functions
function timeoutIfNoAction() {
	var timeSince = new Date().getTime() - usrLastAction.getTime();
	if (usrLoginId != '' && timeSince > usrTimeOutDuration) {
		usrLogoutScheduled = true;
		statusMsg('Logging Out User in 1 minute');
		window.setTimeout(function() {
			if (usrLogoutScheduled) {logOutUser();}
		}, 60000);
	} else {
		window.setTimeout(timeoutIfNoAction, usrTimeOutDuration + 1000);
	}

}


function hideCurrentContentPane() {
	if (document.getElementById(currentContentPane) != undefined) {
		document.getElementById(currentContentPane).style.display = 'none';
	}
	$(document).unbind('keypress');
}


function standardShowContentPane(name) {
	hideCurrentContentPane();
	$('#' + name).fadeIn();
	currentContentPane = name;
}

function hideMainContent() {
	return '';
}

function registerAction() {
	usrLastAction = new Date();
	usrLogoutScheduled = false;
}

window.onbeforeunload = function() {
	if (usrSessionId != '') {
		var msg = 'If you click OK and continue to refresh this page, ';
		msg += ' you will lose any data that has not been saved';
		return msg;
	}
};


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Log Msg Functions
function statusMsg(msg) {
	$('#statusMsg').html(msg);
	logMsg('Console Msg:' + msg);
}
function logMsg(msg, requestId) {
	var timingInfo = '';
	var logId = clientLog.length;
	if (requestId != null && requestId != 'NEW') { logId = requestId; }
	if (logId == clientLog.length) {
		clientLog[logId] = {logDt: new Date()};
	} else {
		timingInfo = ' | timing: ' + (new Date() - clientLog[logId].logDt) + 'ms.';
	}
	clientLog[logId].msg = msg + timingInfo;
	return logId;
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Server Call Functions
function serverCall(params, successCallback, failCallback) {
	if (usrSessionId == '' && params['spwfAction'] != 'authenticate') {
		return false; 
	}//if session is cleared, don't make a new call
	var resourceActionInfo = 'Server Call Resource: ';
 	resourceActionInfo += params['spwfResource'] + ' Action: ';
  resourceActionInfo += params['spwfAction'];
	params['requestId'] = logMsg(resourceActionInfo + ' Started');
	var successCallbackMod = function(rslt) {
		decrementServerCalls();
		logMsg(resourceActionInfo + ' Responded', rslt.requestId);
		if (!validateServerResponse(rslt)) {
			var msg = resourceActionInfo;
		  msg += 'Failed to validate the server response - ';
			msg += rslt['errorMsg'];
			logMsg(msg);
			rslt[SERVER_SIDE_FAIL] = true;
		} else {
			rslt[SERVER_SIDE_FAIL] = false;
		}
		successCallback(rslt);
	};
	var failCallbackMod = function() {
		decrementServerCalls();
	  failCallback();
	};
	incrementServerCalls();
	$.ajax({type: 'POST',
		url: urlTarget,
		dataType: 'json',
		data: params,
		success: successCallbackMod,
		error: failCallbackMod
	});
}

function incrementServerCalls() {
	var msg = 'Open Requests: ' + ++OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}

function decrementServerCalls() {
	OUTSTANDING_SERVER_CALLS = (--OUTSTANDING_SERVER_CALLS < 0) ?
		0 : OUTSTANDING_SERVER_CALLS;
	var msg = 'Open Requests: ' + OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}


function handleServerResponse(msg, startTime, data) {
	if (!validateServerResponse(data)) {
		alert('Sorry, there was a problem communicating with the server.');
		statusMsg('Server Communication Error');
		return false;
	}
	var timing = (new Date().getTime() - startTime.getTime()) / 1000;
	statusMsg(msg + ' in ' + timing + 's');
	return true;
}

function prepParams(params, resource, action) {
	if (params == null) {params = {};}
	params['spwfResource'] = resource;
	params['user_id'] = usrLoginId;
	params['session_id'] = usrSessionId;
	if (action == insertUpdateChoose) {
		if (params['last_update'] != null && params['last_update'] != '') {
			action = 'update';
		} else {
			action = 'insert';
		}
	}
	params['spwfAction'] = action;
	return params;
}

function validateServerResponse(responseTxt) {
	if (responseTxt == undefined || responseTxt == null) {
		logMsg('validateServerResponse - undefined response');
		var msg = 'Sorry, there was an unexpected error ';
		msg += 'communicating with the server.';
		alert(msg);
		return false;
	} else if (responseTxt.errorMsg != undefined) {
		if (responseTxt.errorMsg.indexOf('Session Invalid') > -1) {
			alert('Sorry, the session has expired and you will be logged out');
			usrSessionId = '';
		}
		logMsg('validateServerResponse - Error Msg: ' + responseTxt.errorMsg);
		return false;
	}
	registerAction();
	return true;
}

function isUserAuthorized(request, notifyUser, caller) {
	var result = false;
	var msg = '';
	request = request.toUpperCase();
	for (var i = 0; i < SECURITY_GRANT.length; i++) {
		if (SECURITY_GRANT[i] == request) {
			result = true;
			break;
		}
	}
	if (notifyUser && !result) {
		msg = 'Access Violation (' + request + ' is required)';
		if (caller) {
			msg += ' from ' + caller;
		}
		briefNotify(msg, 'ERROR');
	}
	return result;
}

function securityshow(divIdToSecure) {
	$(divIdToSecure).removeClass('SecurityDisabled');
}

function securityHide(divIdToSecure) {
	$(divIdToSecure).addClass('SecurityDisabled');
}

function securityLockForm(formName, lock) {
	var disableStatus;
	if ($('#' + formName).length == 0) {
		briefNotify('Attempt to Lockdown Empty Form:' + formName, 'ERROR');
	}
	if (lock == undefined) {
		lock = true;
	}

	$.each($('form#' + formName + '> input, >select'),
			function(ndx, field) {
				if (lock) {
		 			$('form#' + formName + ' #' + field.id).attr('disabled', 'disabled');
				} else {
					$('form#' + formName + ' #' + field.id).removeAttr('disabled');
				}
	});
}

function isFormEmpty(formName) {
	if ($('#' + formName + '-last_update').val() == '')return true;
	return false;
}







//cache.js

//loginportal.js
//Begin LoginPortal



function loginCall(action) {
	var params = bindForm('LoginPortalForm');
	
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
	if (validateLoginPortalForm())serverCall(params, successf, FAILF);
}





function logOutUser() {
	usrSessionId = '';
	usrLoginId = '';
	$('#LoginPortalForm-user_id').val('');
	$('#LoginPortalForm-password').val('');
	displayMainLayout(false);
	$('#topMenuBar').hide();
	hideMainContent();
	return;
}


$(document).ready(function() {
	$('#LoginPortalForm-user_id').val('golfscore');
	$('#LoginPortalForm-password').val('golfscore');
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
	params['user_id'] = $('#LoginPortalForm-user_id').val();
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
	$('#LoginPortalForm-password_reset_codeDivId').show();
	$('#LoginPortalForm-passwordDivId').hide();
	$('#LoginPortalForm-password').val('');
	$('#cmdlogin').hide();
	$('#cmdOneTimelogin').show();

}

function onetimeLogin() {
	var params = {};
	params['user_id'] = $('#LoginPortalForm-user_id').val();
	params['password_reset_code'] =
		$('#LoginPortalForm-password_reset_code').val();
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
		$('#LoginPortalForm-password_reset_codeDivId').show();
		$('#cmdlogin').hide();
		$('#cmdOneTimelogin').show();

	};
	$.ajax({type: 'POST', url: passwordResetUrlTarget,
		dataType: 'json', data: params,
		success: successCallback, error: FAILF
	});
}







function onSuccessfulLogin(){
  $.mobile.changePage("#summaryDivId");
}

function validateLoginPortalForm(){
return true;
}



//LayoutComponents.js

function showDialog(msg){
alert(msg);
}
























