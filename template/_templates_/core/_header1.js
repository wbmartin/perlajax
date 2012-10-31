//shared variables
var usrSessionId = '';
var usrLoginId = '';
var usrLastAction = new Date();
var usrLogoutScheduled = false;
var usrTimeOutDuration = 20*60*1000;
var clientLog = new Array();
var insertUpdateChoose = 'INSERTUPDATE';
var FAILF = function(){alert('FAIL');}
var currentContentPane = '';
var SERVER_SIDE_FAIL = 'serverSideFail';
var OUTSTANDING_SERVER_CALLS = 0;
var PAGINATION_ROW_LIMIT = 10;
var CURRENT_PAGE = '';

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Form Functions
function appendValidationMsg(formId,fieldId, msg){
	var fullyQName = 'form#'+formId+' #' + fieldId;
	if ($('form#'+formId).find('#'+fieldId+'Error').attr('id') == undefined) {
		$(fullyQName).after('<span id='' +fieldId + 'Error' class="ValidationMsg"></span>');
	}
	if ( $(fullyQName+'Error').html().length ==0) {
		$(fullyQName+'Error').append('*');
	}
	$(fullyQName+'Error').append(' ' + msg);
	$(fullyQName).addClass('invalid');
}

function highlightFieldError(formId, fieldId, yesNo) {
	var bordercolor='black';
	if (yesNo) bordercolor='red'
		$('form#'+formId+' #'+fieldId).css('border-color:'+bordercolor);

}

function bindForm(formName) {
	var rslt = {};
	var fieldId = '';
	$.each($('form#'+formName+' :input'),
			function(key, field){
				fieldId = field.id.replace(formName+'-','');
				if (field.type != 'button') rslt[fieldId] = field.value
			});
	return rslt;
}

function bindToForm(formName, obj){
	var fieldId = '';
	$.each($('form#'+formName+' :input'),
			function(key, field){
				fieldId = field.id.replace(formName+'-','');
				if (field.type != 'button')  field.value = obj[fieldId];
			});
}

function clearForm(formName){
	var fieldId = '';
	$.each($('form#'+formName+' :input'),
			function(key, field){
				fieldId = field.id.replace(formName+'-','');
				if (field.type == 'checkbox') {
					field.checked = false;
				} else if (field.type != 'button') field.value = '';
			}
			);
	toggleSaveMode(formName, false);
}

function toggleSaveMode(formName, saveMode){
	var buttonToShow = (saveMode)?'Save':'Add';
	var buttonToHide = (!saveMode)?'Save':'Add';
	$('form#'+formName+' #' +formName +buttonToHide).addClass('LogicDisabled');
	$('form#'+formName+' #' +formName +buttonToShow).removeClass('LogicDisabled');



}



function standardValidate(formName){
	var formValid = true;
	if ($('#'+formName).length==0) formValid=false;
	$.each($('form#'+formName + ' span.ValidationMsg'),function (ndx,span){
		span.innerHTML='';
	});
	$.each($('form#'+formName + ' .invalid'),function (ndx,field){
		$('form#'+formName +' #'+field.id).removeClass('invalid');
	});
	$.each($('form#' +formName + ' .VALIDATErequired'),function (ndx,field){
		if (field.value == null || field.value==''){
			appendValidationMsg(formName,field.id, 'Required');
			highlightFieldError(formName,field.id,true);
			formValid =false;
		}
	});
	$.each($('form#' +formName + ' .VALIDATEinteger'),function (ndx,field){
		if (field.value != null && !isInteger(field.value)){
			appendValidationMsg(formName,field.id, 'Integer Input Required');
			highlightFieldError(formName,field.id,true);
			formValid =false;
		}
	});
	$.each($('form#' +formName + ' .VALIDATEmmddyyyydate'),function (ndx,field){
		if (field.value != null && !field.value.match(/\d\d\/\d\d\/\d\d\d\d/)){
			appendValidationMsg(formName,field.id, 'MM/DD/YYYY Required');
			highlightFieldError(formName,field.id,true);
			formValid =false;
		}
	});



	return formValid;
}

function isFieldIdEmpty(fieldId_){
	if (document.getElementById(fieldId_) == undefined) return true;
	if (document.getElementById(fieldId_).value == undefined) return true;
	if (document.getElementById(fieldId_).value == null) return true;
	if (document.getElementById(fieldId_).value == '') return true;
	return false;
}

function isEmpty(val){
	if (typeof(val) == 'undefined')return true;
	if (val == null || val =='') return true;
	return false;
}

function isInteger(value){
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)){
		return true;
	} else {
		return false;
	}
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Formatting Functions
function pgDate(val){
	var rslt;
	if (val !=null) {
		rslt = val.substring(5,7) + '/'+val.substring(8,10) + '/' + val.substring(0,4);
	} else {
		rslt= '';
	}
	return rslt;
}

function formatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas) {
	if (isNaN(parseInt(num))) return '---';
	var tmpNum = num;
	var iSign = num < 0 ? -1 : 1;		// Get sign of number
	tmpNum *= Math.pow(10,decimalNum);
	tmpNum = Math.round(Math.abs(tmpNum))
		tmpNum /= Math.pow(10,decimalNum);
	tmpNum *= iSign;						
	var tmpNumStr = new String(tmpNum);

	// See if we need to strip out the leading zero or not.
	if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
		if (num > 0)tmpNumStr = tmpNumStr.substring(1,tmpNumStr.length);
		else tmpNumStr = '-' + tmpNumStr.substring(2,tmpNumStr.length);

	// See if we need to put in the commas
	if (bolCommas && (num >= 1000 || num <= -1000)) {
		var iStart = tmpNumStr.indexOf('.');
		if (iStart < 0)	iStart = tmpNumStr.length;

		iStart -= 3;
		while (iStart >= 1) {
			tmpNumStr = tmpNumStr.substring(0,iStart) + ',' + tmpNumStr.substring(iStart,tmpNumStr.length)
				iStart -= 3;
		}		
	}

	// See if we need to use parenthesis
	if (bolParens && num < 0) tmpNumStr = '(' + tmpNumStr.substring(1,tmpNumStr.length) + ')';

	if (tmpNumStr.indexOf('.')<0 && decimalNum >0) {
		tmpNumStr += '.';
	}
	while ((tmpNumStr.length -tmpNumStr.indexOf('.')) <= decimalNum) {
		tmpNumStr += '0';

	}

	return tmpNumStr.toString();		// Return our formatted string!
}


String.prototype.ucfirst = function () {
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
function filterCacheArrayByVal (cacheArray, idToSet) {
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
	var newhtml='<option value=""></option>';
	$.each(obj,function(key, val) {
		newhtml += '<option value="' + key + '">' + val +'</option>';
	});
	$(selectId).html(newhtml);

}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Content Functions
function timeoutIfNoAction() { 'use strict';
	var timeSince = new Date().getTime() - usrLastAction.getTime() ;
	if (usrLoginId !='' && timeSince >usrTimeOutDuration ) {
		usrLogoutScheduled = true;
		statusMsg('Logging Out User in 1 minute');
		window.setTimeout(function(){if (usrLogoutScheduled) {logOutUser();}},60000);
	} else {
		window.setTimeout(timeoutIfNoAction, usrTimeOutDuration +1000  );
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

window.onbeforeunload = function () {
	if (usrSessionId !='') {
		var msg = 'If you click OK and continue to refresh this page, ';
		msg += ' you will lose any data that has not been saved';
		return msg;
	}
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Log Msg Functions
function statusMsg(msg) {
	$('#statusMsg').html(msg);
	logMsg('Console Msg:' +msg);
}
function logMsg(msg,requestId) {
	var timingInfo='';
	var logId = clientLog.length;
	if (requestId != null && requestId != 'NEW') { logId = requestId; }
	if (logId == clientLog.length) {
		clientLog[logId] = {logDt: new Date()};
	} else {
		timingInfo = ' | timing: ' + (new Date() -  clientLog[logId].logDt) + 'ms.';
	}
	clientLog[logId].msg= msg+timingInfo;
	return logId;
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Server Call Functions
function serverCall(params, successCallback, failCallback) {
	var resourceActionInfo = 'Server Call Resource: ';
 	resourceActionInfo += params['spwfResource'] + ' Action: ';
  resourceActionInfo += params['spwfAction'];
	params['requestId'] = logMsg(resourceActionInfo + ' Started');
	var successCallbackMod = function(rslt) {
		decrementServerCalls();
		logMsg(resourceActionInfo + ' Responded', rslt.requestId);
		if (!validateServerResponse(rslt)) {
			var msg = resourceActionInfo + ' Failed to validate the server response - ';
			msg += rslt['errorMsg'];
			logMsg(msg);
			rslt[SERVER_SIDE_FAIL] = true;
		} else {
			rslt[SERVER_SIDE_FAIL] = false;
		}	 
		successCallback(rslt);
	}
	incrementServerCalls();
	$.ajax({type: 'POST',
		url: urlTarget,
		dataType: 'json',
		data: params,
		success: successCallbackMod,
		error: failCallback 
	});
}

function incrementServerCalls() {
	var msg = 'Open Requests: ' + ++OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}

function decrementServerCalls() {
	OUTSTANDING_SERVER_CALLS = (--OUTSTANDING_SERVER_CALLS <0) ?
		0:OUTSTANDING_SERVER_CALLS;
	var msg = 'Open Requests: ' + OUTSTANDING_SERVER_CALLS;
	$('#outstandingServerCalls').html(msg);
}


function handleServerResponse(msg, startTime, data) {
	if (!validateServerResponse(data)) {
		alert('[%serverErrorMsg_Communication%]');
		statusMsg('Server Communication Error');
		return false;
	}
	var timing = (new Date().getTime()-startTime.getTime())/1000;
	statusMsg( msg + ' in ' + timing + 's' );
	return true;
}

function prepParams(params, resource, action) {
	if (params == null) { params = {}; }
	params['spwfResource'] = resource;
	params['user_id'] = usrLoginId;
	params['session_id'] = usrSessionId;
	if (action == insertUpdateChoose) {
		if (params['last_update']!= null && params['last_update'] != '') {
			action = 'update';
		} else {
			action = 'insert';
		}
	}
	params['spwfAction'] = action;
	return params;
}

function validateServerResponse(responseTxt) {
	if (responseTxt == undefined || responseTxt == null ) {
		logMsg('validateServerResponse - undefined response');
		var msg = 'Sorry, there was an unexpected error ';
		msg += 'communicating with the server.';
		alert(msg);
		return false;
	} else if (responseTxt.errorMsg != undefined) {
		if (responseTxt.errorMsg.indexOf('Session Invalid') > -1 ) {
			alert('Sorry, the session has expired and you will be logged out');
			usrSessionId = '';
		}
		logMsg ('validateServerResponse - Error Msg: ' + responseTxt.errorMsg);
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
[%# /*
			 wbmartin 2012-08-24 | function to iterate over arbitrary form and disable/enable fields
			 args:	formname - id
			 lock - boolean, true to lock, false to unlock
		 */ %]
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

