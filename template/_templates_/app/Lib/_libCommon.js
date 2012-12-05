//shared variables
[% SRC_LOC = '_libCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/

var usrSessionId = '';
var usrLoginId = '';
var usrLastAction = new Date();
var usrLogoutScheduled = false;
var usrTimeOutDuration = 18 * 60 * 1000;//set 2 min less than actual
var clientLog = new Array();
var insertUpdateChoose = 'INSERTUPDATE';
var FAILF = function() {alert('FAIL');};
var currentContentPane = '';
var SERVER_SIDE_FAIL = 'serverSideFail';
var OUTSTANDING_SERVER_CALLS = 0;
var PAGINATION_ROW_LIMIT = 10;
var CURRENT_PAGE = '';
var TRUSTED_DEVICE = false;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Form Functions
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formId form.
* @param {string} fieldId field.
* @param {string} msg message.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formId form.
* @param {string} fieldId field.
* @param {boolean} yesNo  true for yes.
*/
function highlightFieldError(formId, fieldId, yesNo) {
	var bordercolor = 'black';
	if (yesNo) bordercolor = 'red';
	$('form#' + formId + ' #' + fieldId).css('border-color:' + bordercolor);

}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName form.
* @return {Object} objectified form.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName  form.
* @param {Object} obj object to bind.
*/
function bindToForm(formName, obj) {
	var fieldId = '';
	$.each($('form#' + formName + ' :input'),
			function(key, field) {
				fieldId = field.id.replace(formName + '-', '');
				if (field.type != 'button') field.value = obj[fieldId];
				if (IS_MOBILE && field.type === 'select-one' ) {
						$(field).selectmenu();
						$(field).selectmenu('refresh',true);
					}

			});
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName  form.
*/
function clearForm(formName) {
	var fieldId = '';
	$.each($('form#' + formName + ' :input'),
			function(key, field) {
				fieldId = field.id.replace(formName + '-', '');
				var selectRefreshNeeded = false;
				if (field.type == 'checkbox') {
					field.checked = false;
				} else if (field.type != 'button') {
					if (IS_MOBILE && field.type === 'select-one' && field.value!== '') {
						 selectRefreshNeeded = true;
					}
					field.value = '';
					if (selectRefreshNeeded) { 
						$(field).selectmenu('refresh', true); 
					}
				}
			}
			);
	toggleSaveMode(formName, false);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName  form.
* @param {boolean} saveMode  true for Save, false for Add.
*/
function toggleSaveMode(formName, saveMode) {
	var buttonToShow = (saveMode) ? 'Save' : 'Add';
	var buttonToHide = (!saveMode) ? 'Save' : 'Add';
	var id = 'form#' + formName + ' #' + formName + buttonToHide;
	if (IS_MOBILE) {
		$(id).parent().addClass('LogicDisabled');
	} else {
	  $(id).addClass('LogicDisabled');
	}
	id = 'form#' + formName + ' #' + formName + buttonToShow;
	$(id).removeClass('LogicDisabled');
	if (IS_MOBILE) {
		$(id).parent().removeClass('LogicDisabled');
	} else {
	  $(id).removeClass('LogicDisabled');
	}

}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName  form.
* @return {boolean} validity.
*/
function standardValidate(formName) {
	var formValid = true;
	if ($('#' + formName).length == 0) formValid = false;
	$.each($('form#' + formName + ' span.ValidationMsg'), function(ndx, span) {
		span.innerHTML = '';
	});
	$.each($('form#' + formName + ' .invalid'), function(ndx, field) {
		if (isEmpty(field.id)) {return true;}//skip/continue if no ID
		$('form#' + formName + ' #' + field.id).removeClass('invalid');
	});
	$.each($('form#' + formName + ' .VALIDATErequired'), function(ndx, field) {
		if (isEmpty(field.id)) {return true;}//skip/continue if no ID
		if (isEmpty(field.value)) {
			appendValidationMsg(formName, field.id, 'Required');
			highlightFieldError(formName, field.id, true);
			formValid = false;
		}
	});
	$.each($('form#' + formName + ' .VALIDATEinteger'), function(ndx, field) {
		if (isEmpty(field.id)) {return true;}//skip/continue if no ID
		if (field.value != null && !isInteger(field.value)) {
			appendValidationMsg(formName, field.id, 'Integer Input Required');
			highlightFieldError(formName, field.id, true);
			formValid = false;
		}
	});
	$.each($('form#' + formName + ' .VALIDATEdate_mmddyyyy'),
			function(ndx, field) {
				if (isEmpty(field.id)) {return true;}//skip/continue if no ID
				if (field.value != null && !field.value.match(/\d\d\/\d\d\/\d\d\d\d/)) {
					appendValidationMsg(formName, field.id, 'MM/DD/YYYY Required');
					highlightFieldError(formName, field.id, true);
					formValid = false;
				}
			});
	$.each($('form#' + formName + ' .VALIDATEdate_yyyy-mm-dd'),
			function(ndx, field) {
				if (isEmpty(field.id)) {return true;}//skip/continue if no ID
				if (field.value != null && !field.value.match(/\d\d\d\d-\d\d-\d\d/)) {
					appendValidationMsg(formName, field.id, 'YYYY-MM-DD date Required');
					highlightFieldError(formName, field.id, true);
					formValid = false;
				}
			});

	return formValid;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} fieldId_  field.
* @return {boolean} if field is empty.
*/
function isFieldIdEmpty(fieldId_) {
	if (document.getElementById(fieldId_) == undefined) return true;
	if (document.getElementById(fieldId_).value == undefined) return true;
	if (document.getElementById(fieldId_).value == null) return true;
	if (document.getElementById(fieldId_).value == '') return true;
	return false;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} val to evaluate.
* @return {boolean} true if empty.
*/
function isEmpty(val) {
	return (!val || 0 === val.length);
	[%# replacing isEmpty 2012-11-23 w/ cleaner function
		from http://stackoverflow.com/questions/154059/what-is-the-best-way-to-check-for-an-empty-string-in-javascript
		//if (typeof(val) == 'undefined') return true;
		//if (val == null || val == '') return true;
		//return false;a
		%]
}

/**
*	evalutes emptiness
* @expose
* @return {boolean} is empty.
*/
String.prototype.isEmpty = function() {
	return isEmpty(this);
};



/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} str to evalute.
* @return {boolean}  true if blank.
*/
function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}

/**
*	evalutes blankness
* @expose
* @return {Boolean} is blank.
*/
String.prototype.isEmpty = function() {
	return isBlank(this);
};


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} value to evaluate.
* @return {boolean} is Integer.
*/
function isInteger(value) {
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Formatting Functions
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} val to evaluate.
* @return {string} formatted date.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {object} num  number to format.
* @param {integer} decimalNum  number ofdecimals.
* @param {boolean} bolLeadingZero  include leading zeros.
* @param {boolean} bolParens show negative with parens.
* @param {boolean} bolCommas  format with commas.
* @return {string} formatted val.
*/
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

/**
*	Upper Cases First Letter of a string
* @expose
* @return {String} UCed first letter.
*/
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
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} cacheArray  array.
* @param {string} idToSet  _.
* @return {Object} filtered array.
*/
function filterCacheArrayByVal(cacheArray, idToSet) {
	for (var i = 0; i < cacheArray.length; i++) {
		if (cacheArray[i].val == idToSet)return cacheArray[i];
	}
	return {};
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} er digester.
* @param {Object} ee digestee.
* @return {Object} digested.
*/
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


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} obj _.
* @return {Object} deep Coppied Object.
*/
function deepCopy(obj) {
	return $.extend(true, [], obj);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} selectId  html select.
* @param {Object} obj key/val hash.
*/
function setSelectOptions(selectId, obj) {
	var newhtml = '<option value=""></option>';
	$.each(obj, function(key, val) {
		newhtml += '<option value="' + key + '">' + val + '</option>';
	});
	$(selectId).html(newhtml);
	if (IS_MOBILE) {
		$(selectId).selectmenu();
		$(selectId).selectmenu('refresh',true);
	}

}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Content Functions
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function timeoutIfNoAction() {
	var timeSince = new Date().getTime() - usrLastAction.getTime();
	if (usrLoginId != '' && timeSince > usrTimeOutDuration) {
		if (TRUSTED_DEVICE) {
		  var params = prepParams(params, 'keep_alive', 'select');
		  var successf = function(rslt) { };
	    serverCall(params, successf, FAILF);
		} else {
			usrLogoutScheduled = true;
			statusMsg('Logging Out User in 1 minute');
			window.setTimeout(function() {
				if (usrLogoutScheduled) {logOutUser();}
			}, 60000);
		}
	} else {
		window.setTimeout(timeoutIfNoAction, usrTimeOutDuration);
	}

}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function hideCurrentContentPane() {
	if (document.getElementById(currentContentPane) != undefined) {
		document.getElementById(currentContentPane).style.display = 'none';
	}
	$(document).unbind('keypress');
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} name divid.
*/
function standardShowContentPane(name) {
	hideCurrentContentPane();
	$('#' + name).fadeIn();
	currentContentPane = name;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {string}  empty string.
*/
function hideMainContent() {
	return '';
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function registerAction() {
	usrLastAction = new Date();
	usrLogoutScheduled = false;
}

/**
*  Extends window to unload function
*  @return {string} message to be displayed when user refreshes or leaves.
*/
window.onbeforeunload = function() {
	if (usrSessionId != '') {
		var msg = 'If you click OK and continue to refresh this page, ';
		msg += ' you will lose any data that has not been saved';
		return msg;
	}
};


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Log Msg Functions
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} msg message.
*/
function statusMsg(msg) {
	$('#statusMsg').html(msg);
	logMsg('Console Msg:' + msg);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} msg message.
* @param {string} requestId  request tracker.
* @return {integer} index of new log.
*/
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
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} params  ajax params.
* @param {function} successCallback function to call if successful.
* @param {function} failCallback function to call on failure.
* @return {boolean} allowed.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function incrementServerCalls() {
	var msg = 'Open Requests: ' + ++OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function decrementServerCalls() {
	OUTSTANDING_SERVER_CALLS = (--OUTSTANDING_SERVER_CALLS < 0) ?
		0 : OUTSTANDING_SERVER_CALLS;
	var msg = 'Open Requests: ' + OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {boolean} success.
* @param {string} msg message.
* @param {date} startTime time this started.
* @param {Object} data server response to be validated.
*/
function handleServerResponse(msg, startTime, data) {
	if (!validateServerResponse(data)) {
		alert('[%serverErrorMsg_Communication%]');
		statusMsg('Server Communication Error');
		return false;
	}
	var timing = (new Date().getTime() - startTime.getTime()) / 1000;
	statusMsg(msg + ' in ' + timing + 's');
	return true;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} params  ajax params.
* @param {string} resource  usually table name.
* @param {string} action  select, update, insert, delete.
* @return {object}  preped params.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} responseTxt  response text.
* @return {boolean} validity.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} request  grant to test.
* @param {boolean} notifyUser notify user of result.
* @param {string} caller name of function that is requesting for debugging.
* @return {boolean} authorized.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} divIdToSecure div to show.
*/
function securityshow(divIdToSecure) {
	$(divIdToSecure).removeClass('SecurityDisabled');
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} divIdToSecure div to hide.
*/
function securityHide(divIdToSecure) {
	$(divIdToSecure).addClass('SecurityDisabled');
}
[%# /*
			 wbmartin 2012-08-24 | function to iterate over arbitrary form and disable/enable fields
			 args:	formname - id
			 lock - boolean, true to lock, false to unlock
		 */ %]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName the form.
* @param {boolean} lock true to lock the form.
*/
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

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} formName the form.
* @return {boolean}  empty.
*/
function isFormEmpty(formName) {
	if ($('#' + formName + '-last_update').val() == '')return true;
	return false;
}


/**
SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} dt the form.
* @param {string} format the form.
* @return {boolean}  formatted date.

	*
	*/
function formatDate(dt,format) {
  if (format === 'MM-DD') { return dt.substr(5); }
	return 'format undefined';
}








[%# /*
			 wbmartin 2012-08-25 | on hold in favor of scrolling
			 related calls:

			 retrieve[_pct_ucfirst(divId)_pct_]ListTablePagination(1,PAGINATION_ROW_LIMIT);
			 <!--<div id='[_pct_divId_pct_]ListTablePaginationDivId'></div> -->
/*var [_pct_divId_pct_]ListTablePageNum =1;
function retrieve[_pct_ucfirst(divId)_pct_]ListTablePagination(targetPage, rowLimit){
[_pct_divId_pct_]ListTablePageNum = targetPage;
var params={};
params.rowlimit = rowLimit;
params.startrow = (targetPage-1)* rowLimit;
retrieve[_pct_ucfirst(divId)_pct_](params)
}
		 */
//in retrieve before call: params['spwfPagination']=true;
//in retrieve: $('#[_pct_divId_pct_]ListTablePaginationDivId').html(buildPaginationBlock([_pct_divId_pct_]ListTablePageNum, rslt.spwfTotalItemCount,PAGINATION_ROW_LIMIT,'[_pct_divId_pct_]ListTable'));
//in show: retrieve[_pct_ucfirst(divId)_pct_]ListTablePagination(1,PAGINATION_ROW_LIMIT);

/*

	 function buildPaginationBlock(currentPageNum, totalItemCount,itemsPerPage,functionName){
	 var htmlPageBlock;
	 var totalPageCount = 	Math.round(totalItemCount/itemsPerPage );
	 var firstPage;
	 var lastPage;
	 firstPage = currentPageNum-itemsPerPage/2;
	 lastPage = currentPageNum+itemsPerPage/2;

	 if(firstPage<1)firstPage=1;
	 if(lastPage >totalPageCount) lastPage=totalPageCount;

	 htmlPageBlock='<ul class='pagination' id='' +functionName + 'PaginationULId'>';
	 if (currentPageNum !=1) {
	 htmlPageBlock +=buildPaginationLink('First',functionName,1, itemsPerPage) ;
	 htmlPageBlock +=buildPaginationLink('Prev',functionName,currentPageNum-1, itemsPerPage);
	 }
	 for(var ndx=firstPage;ndx<=lastPage;ndx++){
	 htmlPageBlock +=buildPaginationLink(ndx,functionName, ndx, itemsPerPage);
	 }

	 if (currentPageNum !=totalPageCount){
	 htmlPageBlock +=buildPaginationLink('Next',functionName,currentPageNum+1, itemsPerPage);
	 htmlPageBlock +=buildPaginationLink('Last',functionName,totalPageCount, itemsPerPage);
	 }

	 htmlPageBlock+='</ul>';
	 return htmlPageBlock;
	 }
 */ %]

[%# /*
			 wbmartin 2012-08-25 | used in conjunction with buildPaginationBlock on hold

			 function buildPaginationLink(linkTitle, functionName,targetPage, itemsPerPage){
			 var plink;
			 var functionCall = 'retrieve' +functionName.ucfirst() + 'Pagination(' + targetPage +','+itemsPerPage+'); ';
			 plink = '<li><span onclick='' + functionCall  + ''>' +linkTitle + '</span></li>';
			 return plink;

			 }
		 */ %]

[%# /*
			 wbmartin 2012-08-25 | created to synchronize tables split for scrolling
			 function synchTableColWidths(t1_,t2_, finalWidths_){
			 var t1widths = new Array();
			 if (finalWidths_ == undefined){// if final widths is not defined, determine largest width foreach col
			 finalWidths_ = new Array();
			 $.each($('#'+t1_ +' tr:first').children(),function(ndx_,td_){
			 t1widths[ndx_] = $(td_).width();
			 });
			 $.each($('#'+t2_ +' tr:first ').children(),function(ndx_,td_){
			 finalWidths_[ndx_] = ($(td_).width() >t1widths[ndx_])?$(td_).width() :t1widths[ndx_] ;     
			 });
			 }
// use finalwidths
$.each($('#'+t1_ +' tr:first ').children(),function(ndx_,td_){  $(td_).width(finalWidths_[ndx_])});
$.each($('#'+t2_ +' tr:first ').children(),function(ndx_,td_){  $(td_).width(finalWidths_[ndx_])});
}
function setCurrentPage(divId_){
CURRENT_PAGE=divId_;
top.location
}*/ %]

