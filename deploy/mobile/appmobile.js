'use strict';
    var urlTarget = '../cgi-bin/server.pl';
    var passwordResetUrlTarget = '../cgi-bin/pwdreset.pl';
    var VIEW_ID = 0;
    var PAGE_CALLS = new Array();
    var DEFAULT_LOADING_MSG = $.mobile.loadingMessage;
    var IS_MOBILE = true;

function onBodyLoad() {
  $.mobile.changePage('#LoginPortalDivId');
}


//header1.js
//shared variables

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {string} val to evaluate.
* @return {boolean} true if empty.
*/
function isEmpty(val) {
  return (!val || 0 === val.length);

}

/**
*  evalutes emptiness
* @expose
* @return {boolean} is empty.
*/
String.prototype.isEmpty = function() {
  return isEmpty(this);
};



/**
*
* SRC: _libCommon
*=====================================================================
* @param {string} str to evalute.
* @return {boolean}  true if blank.
*/
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

/**
*  evalutes blankness
* @expose
* @return {Boolean} is blank.
*/
String.prototype.isEmpty = function() {
  return isBlank(this);
};


/**
*
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {string} val to evaluate.
* @return {string} formatted date.
*/
function pgDate(val) {
  var rslt;
  if (val != null) {
    rslt = val.substring(0, 4) + '-';
    rslt += val.substring(5, 7) + '-' + val.substring(8, 10);
  } else {
    rslt = '';
  }
  return rslt;
}

/**
*
* SRC: _libCommon
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
  var iSign = num < 0 ? -1 : 1;    // Get sign of number
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

  return tmpNumStr.toString();    // Return our formatted string!
}

/**
*  Upper Cases First Letter of a string
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {Object} obj _.
* @return {Object} deep Coppied Object.
*/
function deepCopy(obj) {
  return $.extend(true, [], obj);
}

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @return {string}  empty string.
*/
function hideMainContent() {
  return '';
}

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {string} msg message.
*/
function statusMsg(msg) {
  $('#statusMsg').html(msg);
  logMsg('Console Msg:' + msg);
}
/**
*
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
*/
function incrementServerCalls() {
  var msg = 'Open Requests: ' + ++OUTSTANDING_SERVER_CALLS;
  $('#outstandingServerCalls').html(msg);
}

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @return {boolean} success.
* @param {string} msg message.
* @param {date} startTime time this started.
* @param {Object} data server response to be validated.
*/
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

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {string} divIdToSecure div to show.
*/
function securityshow(divIdToSecure) {
  $(divIdToSecure).removeClass('SecurityDisabled');
}

/**
*
* SRC: _libCommon
*=====================================================================
* @param {string} divIdToSecure div to hide.
*/
function securityHide(divIdToSecure) {
  $(divIdToSecure).addClass('SecurityDisabled');
}

/**
*
* SRC: _libCommon
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
* SRC: _libCommon
*=====================================================================
* @param {string} formName the form.
* @return {boolean}  empty.
*/
function isFormEmpty(formName) {
  if ($('#' + formName + '-last_update').val() == '')return true;
  return false;
}


/**
SRC: _libCommon
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















//ClientLog.js

//cache.js

/**
*
* SRC: _cacheCommon
*=====================================================================
*/
var GOLFER_CACHE;
var SECURITY_PROFILE_CACHE;
var SECURITY_GRANT;

/**
*
* SRC: _cacheCommon
*=====================================================================
* @param {Object} data data retrieve from server to update local cache.
*/

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
  populateAppSelectOptions();
  imposeApplicationSecurityRestrictions();
  }


/**
*
* SRC: _cacheCommon
*/

function retrieveCache() {
  var params = prepParams(params, 'cross_table_cache', 'select');
  var successf = function(rslt) {
    onRefreshCache(rslt.rows);
  };
  serverCall(params, successf, FAILF);
}




/**
*
* SRC: _cacheMobile
*/
function populateAppSelectOptions() {
  setSelectOptions('#quickGolfScoreForm select[name=golfer_id]',
                    GOLFER_CACHE
                  );
}

/**
*
* SRC: _cacheMobile
*/
function imposeApplicationSecurityRestrictions() {

}

//loginportal.js
//Begin LoginPortal




/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 * @param {string} action  action pass through.
 */
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





/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
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


/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
$(document).ready(function() {
  $('#LoginPortalForm-user_id').val('golfscore');
  $('#LoginPortalForm-password').val('golfscore');
});

/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
function showLoginPortal() {
  $(document).keypress(function(e) {
    if (e.keyCode == 13) {//enter
      loginCall('authenticate');
    }
  });

}
/**
 *
 * SRC: _loginPortalCommon
 * =====================================================================
 * @return {boolean} success.
 */
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

/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
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
/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
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

/**
 *
 * SRC: _loginPortalCommon
 *=====================================================================
 */
function prepForOneTimeEntry() {
  $('#LoginPortalForm-password_reset_codeDivId').show();
  $('#LoginPortalForm-passwordDivId').hide();
  $('#LoginPortalForm-password').val('');
  $('#cmdlogin').hide();
  $('#cmdOneTimelogin').show();

}

/**
 *
 * SRC: _loginPortalCommon
 * =====================================================================
 * @return {boolean} success.
 */
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







/**
*
* SRC: _loginPortalMobile.js
*=====================================================================
*/
function onSuccessfulLogin() {
  retrieveCache();
  showLaunchPane();
  if ($('#trustedDeviceId').value === 'on') {
    TRUSTED_DEVICE = true;
  } else {
    TRUSTED_DEVICE = false;
  }
}

/**
*
* SRC: _loginPortalMobile.js
*=====================================================================
* @return {boolean} validity.
*/
function validateLoginPortalForm() {
  return true;
}

/**
*
* SRC: _loginPortalMobile.js
*=====================================================================
*/
$(document).ready(function() {
});



//LayoutComponents.js

/**
*
* SRC: LayoutComponentsCommon
*=====================================================================
*/



/**
 *
 * SRC: _layoutComponentsMobile
 *=====================================================================
 * @param {string} msg message.
 */
function showDialog(msg) {
  alert(msg);
}

/**
 *
 * SRC: _layoutComponentsMobile
 *=====================================================================
 * @param {string} title_ title.
 * @param {string} msg_ message.
 */
function showDialog(title_, msg_) {
  $('#userMsgDialog #title').html(title_);
  $('#userMsgDialog #msg').html(msg_);
  $.mobile.changePage('#userMsgDialog', {'transition': 'pop'});


}

/**
 *
 * SRC: _layoutComponentsMobile
 *=====================================================================
 * @param {string} msg  message.
 * @param {string} type type.
 */
function briefNotify(msg, type) {
  var color;
  if (type == null || type == 'INFO') {
    color = 'ui-body-b';
  }else if (type == 'WARNING') {
    color = 'ui-body-b';
  }else if (type == 'ERROR') {
    color = 'ui-body-e';
  }else {
    color = 'ui-body-a';
  }

  var msgDiv = '<div class="ui-loader ui-overlay-shadow ';
  msgDiv +=  color + ' ui-corner-all"><h3>';
  msgDiv += msg + '</h3></div>';
  $(msgDiv)
    .css({ display: 'block',
      opacity: 0.90,
      position: 'fixed',
      padding: '7px',
      'text-align': 'center',
      width: '270px',
      left: ($(window).width() - 284)/2,
      top: $(window).height()/2 })
    .appendTo( $.mobile.pageContainer ).delay( 1500 )
    .fadeOut( 400, function(){
      $(this).remove();
    });
}












/**
*
* SRC: _golfScoreSummaryCommon
*=====================================================================
* @return {boolean} allowed.
*/
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


/**
*
* SRC: _golfScoreSummaryCommon
*=====================================================================
*/
function imposeGolfScoreSummarySecurityUIRestrictions() {

}












//After complete Load setup
$(document).ready(function() {

});



/**
*
* SRC: _golfScoreSummaryMobile
*=====================================================================
* @param {Object} dataRows  array of GolfScoreSummary objects.
*/
function populateGolfScoreSummaryListTable(dataRows) {
//  var dataArray = new Array();
  var newRow = '<div class = "ui-block-a"><b>Golfer</b></div>';
  newRow += '<div class = "ui-block-b"><b>Handicap</b></div>';
  var newTable = newRow;

  for (var ndx = 0; ndx < dataRows.length; ndx++) {
    newTable += buildGolfScoreSummaryListTableRow(dataRows[ndx]);
  }
  $('#golfScoreSummaryTableId').html(newTable);



}

/**
*
* SRC: _golfScoreSummaryMobile
*=====================================================================
* @param {Object} data rowdata.
* @return {string}  built div.
*/
function buildGolfScoreSummaryListTableRow(data) {
  var newRow = '<div class = "ui-block-a">' + data.golfer_name + '</div>';
  newRow += '<div class = "ui-block-b">';
  newRow += formatNumber(data.golf_score, 2, true, false, true);
  newRow += '</div>';
  return newRow;
}
/**
*
* SRC: _golfScoreSummaryMobile
*=====================================================================
*/
function showGolfScoreSummary() {
  retrieveGolfScoreSummaryList();
  $.mobile.changePage('#golfScoreSummaryDivId');
}













//Server Calls

/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @return {boolean} allowed.
*/
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
/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @param {Object} params data.
* @return {boolean} allowed.
*/
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



/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @param {integer} golfScoreId_ prkey.
* @param {string } lastUpdate_ for tran mgt.
* @return {boolean} allowed.
*/
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

/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @param {Object} params data.
* @return {boolean} allowed.
*/
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
/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @param {integer} quickGolfScoreId_ prkey.
* @return {boolean} allowed.
*/
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

/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @return {boolean} allowed.
*/
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



/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
*/
function clearQuickGolfScoreForm() {
  clearForm('quickGolfScoreForm');
  (isUserAuthorized('INSERT_GOLF_SCORE', false)) ?
    securityLockForm('quickGolfScoreForm', false) :
    securityLockForm('quickGolfScoreForm', true);
}


//After complete Load setup
/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
*/
$(document).ready(function() {

    });

//page specific functions


/**
*
* SRC: _quickGolfScoreCommon
*=====================================================================
* @param {integer} golferId_ prkey.
* @return {boolean} allowed.
*/

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

/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @return {boolean} validity.
*/
function validateQuickGolfScoreForm() {
  var formName = 'quickGolfScoreForm';
  var formValid = standardValidate(formName);
  return formValid;
}

//Top Level HTML Manip
/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {Object} dataRows  array of hash objects.
*/
function populateQuickGolfScoreListTable(dataRows) {
    var newRow = '<div class = "ui-block-a ui-th">Golfer</div>';
  newRow += '<div class = "ui-block-b ui-th">Score (Date)</div>';
  var newTable = newRow;

  for (var ndx = 0; ndx < dataRows.length; ndx++) {
    newTable += buildQuickGolfScoreListTableRow(dataRows[ndx]);
  }
  $('#quickGolfScoreTableId').html(newTable);

}

/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {Object} data  rowdata.
*/
function buildQuickGolfScoreListTableRow(data) {
  var newRow = '<div class = "ui-block-a ui-td">';
  newRow +=  GOLFER_CACHE[data['golfer_id']] + '</div>';
  newRow += '<div class = "ui-block-b ui-td">';
  newRow += '<a href="#" onclick="showQuickGolfScoreEntry(';
  newRow +=  data['golf_score_id'] + ')">';
  newRow +=  formatNumber(data['golf_score'], 0, true, false, true);
  newRow += ' (' + formatDate(data['game_dt'],'MM-DD');
  newRow += ')';
  newRow += '</a>';
  newRow += '</div>';
  return newRow;


}

/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {Object} row row to replace.
*/
function replaceQuickGolfScoreListTableRow(row) {
}
/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {Object} row row to add.
*/
function addNewQuickGolfScoreListTableRow(row) {
}
/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {integer} golfScoreId_ prkey.
*/
function removeQuickGolfScoreListTableRow(golfScoreId_) {
}

//Div Access and App Layout Calls
/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
* @param {integer} id pkey to show
*/
function showQuickGolfScoreEntry(id) {
  var params = {};
  if(id) {
    params['where_clause'] = 'golf_score_id = ' + id;
    retrieveQuickGolfScore(params)
  } else {
    clearQuickGolfScoreForm();
  }
  $.mobile.changePage('#quickGolfScoreEntryDivId');
}

/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
*/
function showQuickGolfScoreHistory() {
  retrieveQuickGolfScoreList();
  $.mobile.changePage('#quickGolfScoreHistoryDivId');
}


/**
*
* SRC: _quickGolfScoreMobile
*=====================================================================
*/
function imposeQuickGolfScoreSecurityUIRestrictions() {

}













/**
*
* SRC: _launchCommon
*=====================================================================
*/





/**
*
* SRC: _LaunchMobile
*=====================================================================
*/

function showLaunchPane() {
  $.mobile.changePage('#launchPaneDivId');
}
/**
*
* SRC: _LaunchMobile
*=====================================================================
*/
function imposeLauncherSecurityUIRestrictions() {

}










