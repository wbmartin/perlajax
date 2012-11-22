'use strict';
    var urlTarget = '../cgi-bin/server.pl';
    var passwordResetUrlTarget = '../cgi-bin/pwdreset.pl';
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







//ClientLog.js

//cache.js
var GOLFER_CACHE;
var SECURITY_PROFILE_CACHE;
var SECURITY_GRANT;
function onRefreshCache(data) {
	GOLFER_CACHE = {};
	SECURITY_PROFILE_CACHE = {};
	SECURITY_GRANT = new Array();
	for (var i = 0; i < data.length; i++) {
		if (data[i].tp === 'golfer') {
			GOLFER_CACHE[data[i].val] = data[i].lbl;
		} else if (data[i].tp === 'securityProfile') {
			SECURITY_PROFILE_CACHE[data[i].val] = data[i].lbl;
		} else if (data[i].tp === 'securityGrant') {
			SECURITY_GRANT.push(data[i].lbl);
		}
	}
  populateAppSelectOptions;
  imposeApplicationSecurityRestrictions;	
	}



function retrieveCache() {
	var params = prepParams(params, 'cross_table_cache', 'select');
	var successf = function(rslt) {
		onRefreshCache(rslt.rows);
	};
	serverCall(params, successf, FAILF);
}



function populateAppSelectOptions(){

}
function imposeApplicationSecurityRestrictions(){

}

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
	retrieveCache();
	showLaunchPane();
}

function validateLoginPortalForm(){
  return true;
}



//LayoutComponents.js

function showDialog(msg){
alert(msg);
}










function retrieveGolfScoreSummaryList() {
		if (!isUserAuthorized('SELECT_GOLFER_HANDICAP')) {
			briefNotify('Access Violation', 'ERROR');
			return false;
		}

		var params = prepParams(params, 'golf_score_summary' , 'select');
		var successf = function(rslt) {
			if (!rslt[SERVER_SIDE_FAIL]) {
				populateGolfScoreSummaryListTable(rslt.rows);
			}else {
				briefNotify(
						'There was a problem communicating with the Server.',
						'ERROR');
			}

		};
		var failf = function() {alert('failed');};
		serverCall(params, successf, failf);

	}



function imposeGolfScoreSummarySecurityUIRestrictions() {

}












//After complete Load setup
$(document).ready(function() {
		
});


function populateGolfScoreSummaryListTable(dataRows) {
	var dataArray = new Array();
	var newRow = '<div class = "ui-block-a"><b>Golfer</b></div>';
	newRow += '<div class = "ui-block-b"><b>Handicap</b></div>';
	var newTable = newRow;

	for (var ndx = 0; ndx < dataRows.length; ndx++) {
		newTable += buildGolfScoreSummaryListTableRow(dataRows[ndx]);
	}
	$('#golfScoreSummaryTableId').html(newTable);



}

function buildGolfScoreSummaryListTableRow(gs){
	var newRow = '<div class = "ui-block-a">' + gs.golfer_name + '</div>';
	newRow += '<div class = "ui-block-b">';
  newRow +=	formatNumber(gs.golf_score, 2, true, false, true);
  newRow +=	'</div>';
	return newRow;
}
function showGolfScoreSummary(){
	retrieveGolfScoreSummaryList();
	$.mobile.changePage("#golfScoreSummaryDivId");

}














//Server Calls
function retrieveQuickGolfScoreList() {
	if (!isUserAuthorized(
				'SELECT_GOLF_SCORE',
				true,
				'retrieveQuickGolfScoreList')) {
				 	return false;
				}

	var params = prepParams(params, 'golf_score' , 'select');
	params['orderby_clause'] = ' order by game_dt desc';
		var successf = function(rslt) {
			if (!rslt[SERVER_SIDE_FAIL]) {
				populateQuickGolfScoreListTable(rslt.rows);
			}else {
				briefNotify(
						'There was a problem communicating with the Server.',
						'ERROR'
						);
			}
		};
	serverCall(params, successf, FAILF);
}
function retrieveQuickGolfScore(params) {
	if (!isUserAuthorized(
				'SELECT_GOLF_SCORE',
				true,
				'retrieveQuickGolfScore')) {
					return false;
				}

	params = prepParams(params, 'golf_score', 'SELECT');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
			bindToForm('quickGolfScoreForm', rslt.rows[0]);
			toggleSaveMode('quickGolfScoreForm', true);
		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}



function deleteQuickGolfScore(golfScoreId_, lastUpdate_) {
	if (!isUserAuthorized(
				'DELETE_GOLF_SCORE',
				true,
				'deleteQuickGolfScore')) {
	 	return false;
}
	var params = prepParams(params, 'golf_score' , 'delete');
	params['golf_score_id'] = golfScoreId_;
	params['last_update'] = lastUpdate_;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			removeQuickGolfScoreListTableRow(rslt.golf_score_id);
			briefNotify('Golf Score Deleted Successfully', 'INFO');
		} else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}

function saveQuickGolfScore(params) {
	if (!isUserAuthorized('UPDATE_GOLF_SCORE', false) &&
			!isUserAuthorized('INSERT_GOLF_SCORE', false)) {
		briefNotify(
				'Access Violation : saveQuickGolfScore ',
				'ERROR'
				);
		return false;
	}

	params = prepParams(params, 'golf_score', insertUpdateChoose);
	var successf = function(rslt) {
		clearForm('quickGolfScoreForm');
		if (!rslt[SERVER_SIDE_FAIL]) {
			if (rslt.spwfAction == 'UPDATE') {
				replaceQuickGolfScoreListTableRow(rslt.rows[0]);
			}else if (rslt.spwfAction == 'INSERT') {
				addNewQuickGolfScoreListTableRow(rslt.rows[0]);
			}
			briefNotify('Golf Score Successfully Saved', 'INFO');
			clearQuickGolfScoreForm();

		}
		else {
			briefNotify('Golf Score Saved Failed', 'ERROR');

		}
	};
	serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editQuickGolfScore(quickGolfScoreId_) {
	if (!isUserAuthorized(
				'SELECT_GOLF_SCORE',
				true,
				'editQuickGolfScore')) {
				 	return false;
				}
	if (isUserAuthorized('UPDATE_GOLF_SCORE', false)) {
		securityLockForm('quickGolfScoreForm', false);
	}else {securityLockForm('quickGolfScoreForm', true);}


	if (quickGolfScoreId_) {
		var params = {'where_clause' : 'golf_score_id=' + quickGolfScoreId_};
		retrieveQuickGolfScore(params);
	}
}

function saveQuickGolfScoreForm() {
	if (!isUserAuthorized('UPDATE_GOLF_SCORE') &&
			!isUserAuthorized('SELECT_GOLF_SCORE')) {
		briefNotify('Access Violation : save', 'ERROR');
		return false;
	}

	if (validateQuickGolfScoreForm()) {
		var params = bindForm('quickGolfScoreForm');
		saveQuickGolfScore(params);
	}
}



function clearQuickGolfScoreForm() {
	clearForm('quickGolfScoreForm');
	(isUserAuthorized('INSERT_GOLF_SCORE', false)) ?
		securityLockForm('quickGolfScoreForm', false) :
		securityLockForm('quickGolfScoreForm', true);
}


//After complete Load setup
$(document).ready(function() {
		$('#quickGolfScoreForm-game_dt').datepicker();

		});

//page specific functions
function retrieveGolferNameForGolfScore(golferId_) {
	if (!isUserAuthorized(
				'SELECT_GOLF_SCORE',
				true,
				'retrieveGolferNameForGolfScore')) {
					return false;
				}

	var params = prepParams(params, 'GOLFER', 'SELECT');
	params['where_clause'] = 'golfer_id =' + golferId_;
	var successf = function(rslt) {
		$('#quickGolfScoreGolferNameId').html(rslt.rows[0].name);
	};
	serverCall(params, successf, FAILF);
}











//validation
function validateQuickGolfScoreForm() {
	var formName = 'quickGolfScoreForm';
	var formValid = standardValidate(formName);
	return true;
}

//Top Level HTML Manip
function populateQuickGolfScoreListTable(dataRows) {
	
}

function buildQuickGolfScoreListTableRow(data) {
}

function replaceQuickGolfScoreListTableRow(row) {
}
function addNewQuickGolfScoreListTableRow(row) {
}
function removeQuickGolfScoreListTableRow(golfScoreId_) {
}

//Div Access and App Layout Calls
function showQuickGolfScore() {
  $.mobile.changePage("#quickGolfScoreDivId");
}

function imposeQuickGolfScoreSecurityUIRestrictions() {
	
}
















function showLaunchPane(){
	$.mobile.changePage("#launchPaneDivId");
}
function imposeLauncherSecurityUIRestrictions() {

}










