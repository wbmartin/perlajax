'use strict';
    var urlTarget = 'cgi-bin/server.pl';
    var passwordResetUrlTarget='cgi-bin/pwdreset.pl';
    var VIEW_ID=0;
    var PAGE_CALLS = new Array();


//header1.js
//shared variables
var usrSessionId = "";
var usrLoginId = "";
var usrLastAction = new Date();
var usrLogoutScheduled = false;
var usrTimeOutDuration = 20*60*1000;
var clientLog = new Array();
var insertUpdateChoose = "INSERTUPDATE";
var FAILF = function(){alert("FAIL");}
var currentContentPane = "";
var SERVER_SIDE_FAIL = 'serverSideFail';
var OUTSTANDING_SERVER_CALLS = 0;
var PAGINATION_ROW_LIMIT = 10;
var CURRENT_PAGE = "";

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Form Functions
function appendValidationMsg(formId,fieldId, msg){
  var fullyQName = "form#"+formId+" #" + fieldId;
  if($("form#"+formId).find("#"+fieldId+"Error").attr("id") == undefined) {
    $(fullyQName).after("<span id='" +fieldId + "Error' class='ValidationMsg'></span>");
  }
  if( $(fullyQName+"Error").html().length ==0) {
    $(fullyQName+"Error").append("*");
  }
  $(fullyQName+"Error").append(" " + msg);
  $(fullyQName).addClass("invalid");
}

function highlightFieldError(formId, fieldId, yesNo) {
  var bordercolor="black";
  if  (yesNo) bordercolor="red"
    $("form#"+formId+" #"+fieldId).css("border-color:"+bordercolor);

}

function bindForm(formName) {
  var rslt = {};
  var fieldId = "";
  $.each($("form#"+formName+" :input"), 
      function(key, field){
        fieldId = field.id.replace(formName+"-","");
        if(field.type != 'button') rslt[fieldId] = field.value
      });
  return rslt;
}

function bindToForm(formName, obj){
  var fieldId = "";
  $.each($("form#"+formName+" :input"), 
      function(key, field){
        fieldId = field.id.replace(formName+"-","");
        if(field.type != 'button')  field.value = obj[fieldId];
      });
}

function clearForm(formName){
  var fieldId = "";
  $.each($("form#"+formName+" :input"), 
      function(key, field){
        fieldId = field.id.replace(formName+"-","");
        if (field.type == 'checkbox') {
          field.checked=false;
        }else if(field.type != 'button') field.value = "";
      }
      );
  toggleSaveMode(formName, false);
}

function toggleSaveMode(formName, saveMode){
  var buttonToShow = (saveMode)?"Save":"Add";
  var buttonToHide = (!saveMode)?"Save":"Add";
  $("form#"+formName+" #" +formName +buttonToHide).addClass("LogicDisabled");
  $("form#"+formName+" #" +formName +buttonToShow).removeClass("LogicDisabled");



}



function standardValidate(formName){
  var formValid = true;
  if($("#"+formName).length==0) formValid=false;
  $.each($("form#"+formName + " span.ValidationMsg"),function (ndx,span){
    span.innerHTML="";
  });
  $.each($("form#"+formName + " .invalid"),function (ndx,field){
    $("form#"+formName +" #"+field.id).removeClass("invalid");
  });
  $.each($("form#" +formName + " .VALIDATErequired"),function (ndx,field){
    if(field.value == null || field.value==""){
      appendValidationMsg(formName,field.id, "Required");
      highlightFieldError(formName,field.id,true);
      formValid =false;
    }
  });
  $.each($("form#" +formName + " .VALIDATEinteger"),function (ndx,field){
    if(field.value != null && !isInteger(field.value)){
      appendValidationMsg(formName,field.id, "Integer Input Required");
      highlightFieldError(formName,field.id,true);
      formValid =false;
    }
  });
  $.each($("form#" +formName + " .VALIDATEmmddyyyydate"),function (ndx,field){
    if(field.value != null && !field.value.match(/\d\d\/\d\d\/\d\d\d\d/)){
      appendValidationMsg(formName,field.id, "MM/DD/YYYY Required");
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
  if (document.getElementById(fieldId_).value == "") return true;
  return false;
}

function isEmpty(val){
  if (typeof(val) == "undefined")return true;
  if (val == null || val =="") return true;
  return false;
}

function isInteger(value){ 
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
    return true;
  } else { 
    return false;
  } 
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Formatting Functions
function pgDate(val){
  var rslt;
  if (val !=null){
    rslt = val.substring(5,7)+"/"+val.substring(8,10) +"/"+ val.substring(0,4);
  }else{
    rslt= "";
  }
  return rslt;
}

function formatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas){ 
  if (isNaN(parseInt(num))) return "---";
  var tmpNum = num;
  var iSign = num < 0 ? -1 : 1;    // Get sign of number
  tmpNum *= Math.pow(10,decimalNum);
  tmpNum = Math.round(Math.abs(tmpNum))
    tmpNum /= Math.pow(10,decimalNum);
  tmpNum *= iSign;            
  var tmpNumStr = new String(tmpNum);

  // See if we need to strip out the leading zero or not.
  if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
    if (num > 0)tmpNumStr = tmpNumStr.substring(1,tmpNumStr.length);
    else tmpNumStr = "-" + tmpNumStr.substring(2,tmpNumStr.length);

  // See if we need to put in the commas
  if (bolCommas && (num >= 1000 || num <= -1000)) {
    var iStart = tmpNumStr.indexOf(".");
    if (iStart < 0)  iStart = tmpNumStr.length;

    iStart -= 3;
    while (iStart >= 1) {
      tmpNumStr = tmpNumStr.substring(0,iStart) + "," + tmpNumStr.substring(iStart,tmpNumStr.length)
        iStart -= 3;
    }    
  }

  // See if we need to use parenthesis
  if (bolParens && num < 0) tmpNumStr = "(" + tmpNumStr.substring(1,tmpNumStr.length) + ")";

  if(tmpNumStr.indexOf(".")<0 && decimalNum >0){
    tmpNumStr += ".";
  }
  while((tmpNumStr.length -tmpNumStr.indexOf(".")) <= decimalNum){
    tmpNumStr += "0";

  }

  return tmpNumStr.toString();    // Return our formatted string!
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
function filterCacheArrayByVal ( cacheArray, idToSet){
  for(var i=0;i<cacheArray.length;i++){
    if(cacheArray[i].val == idToSet)return cacheArray[i];
  }
  return {};
}

function digest(er, ee) {
  if (null == ee || "object" != typeof ee || null == er || "object" != typeof er ) return er;
  for (var attr in ee) {
    er[attr] = ee[attr];
  }
  return er;
}


function deepCopy(obj){
  return $.extend(true, [], obj);
}

function setSelectOptions(selectId, obj){
  var newhtml="<option value=''></option>";
  $.each(obj,function(key,val){
    newhtml += "<option value='" + key + "'>"+val +"</option>";
  });
  $(selectId).html(newhtml);

}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Content Functions
function timeoutIfNoAction(){ "use strict";
  var timeSince = new Date().getTime() - usrLastAction.getTime() ;
  if(usrLoginId !="" && timeSince >usrTimeOutDuration ){
    usrLogoutScheduled = true;
    statusMsg("Logging Out User in 1 minute");
    window.setTimeout(function(){if (usrLogoutScheduled){logOutUser();}},60000);
  }else{
    window.setTimeout(timeoutIfNoAction, usrTimeOutDuration +1000  );
  }

}


function hideCurrentContentPane(){
  if(document.getElementById(currentContentPane)!= undefined){
    document.getElementById(currentContentPane).style.display="none";
  }
  $(document).unbind("keypress");
}


function standardShowContentPane(name){
  hideCurrentContentPane();
  $("#"+name).fadeIn();
  currentContentPane= name;
}

function hideMainContent(){
  return "";
}

function registerAction(){
  usrLastAction= new Date();
  usrLogoutScheduled = false;
}

window.onbeforeunload = function () {
  if(usrSessionId !=""){
    return "If you click OK and continue to refresh this page, you will lose any data that has not been saved"
  }
}


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Log Msg Functions
function statusMsg(msg){
  $("#statusMsg").html(msg);
  logMsg("Console Msg:" +msg);
}
function logMsg(msg,requestId){
  var timingInfo="";
  var logId = clientLog.length;
  if (requestId != null && requestId != "NEW"){ logId = requestId; }
  if( logId == clientLog.length){ 
    clientLog[logId] = {logDt: new Date()}; 
  }else{
    timingInfo = " | timing: " + (new Date() -  clientLog[logId].logDt) + "ms.";
  }
  clientLog[logId].msg= msg+timingInfo;
  return logId;
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Server Call Functions
function serverCall(params, successCallback, failCallback){
  var resourceActionInfo = "Server Call Resource: " + params['spwfResource'] + " Action: " + params['spwfAction'];
  params['requestId'] =logMsg(resourceActionInfo + " Started");
  var successCallbackMod = function(rslt){
    decrementServerCalls();
    logMsg(resourceActionInfo + " Responded", rslt.requestId);
    if(!validateServerResponse(rslt)){
      logMsg(resourceActionInfo + " Failed to validate the server response - " +  rslt['errorMsg']);
      rslt[SERVER_SIDE_FAIL] = true;
    }else{
      rslt[SERVER_SIDE_FAIL] = false;
    }    
    successCallback(rslt);
  }
  incrementServerCalls();
  $.ajax({type: "POST", url: urlTarget, dataType: "json", data: params, 
    success: successCallbackMod, error: failCallback });
}

function incrementServerCalls(){
  $("#outstandingServerCalls").html("Open Requests: " + ++OUTSTANDING_SERVER_CALLS)
}

function decrementServerCalls(){
  OUTSTANDING_SERVER_CALLS = (--OUTSTANDING_SERVER_CALLS <0)?0:OUTSTANDING_SERVER_CALLS;
  $("#outstandingServerCalls").html("Open Requests: " +OUTSTANDING_SERVER_CALLS);
}


function handleServerResponse(msg, startTime, data){
  if(!validateServerResponse(data)){
    alert("Sorry, there was a problem communicating with the server.");
    statusMsg("Server Communication Error");
    return false;
  }
  statusMsg( msg +" in " + (new Date().getTime()-startTime.getTime())/1000 + "s" );
  return true;
}

function prepParams(params, resource, action){
  if(params == null){ params = {}; }
  params['spwfResource'] = resource;
  params['user_id'] = usrLoginId;
  params['session_id'] = usrSessionId;
  if (action ==insertUpdateChoose){
    if(params['last_update']!= null && params['last_update']!= ""){
      action = "update";
    }else{
      action= "insert";
    }
  }
  params['spwfAction'] = action;
  return params;
}

function validateServerResponse(responseTxt){
  if(responseTxt == undefined ||responseTxt==null ){
    logMsg("validateServerResponse - undefined response");
    alert("Sorry, there was an unexpected error communicating with the server.");
    return false;
  }else if(responseTxt.errorMsg != undefined){
    if(responseTxt.errorMsg.indexOf('Session Invalid')>-1 ){
      alert("Sorry, the session has expired and you will be logged out");
      usrSessionId="";
    }
    logMsg ("validateServerResponse - Error Msg: " + responseTxt.errorMsg);
    return false;
  }
  registerAction();
  return true;
}

function isUserAuthorized(request, notifyUser, caller){
  var result= false;
  var msg="";
  request = request.toUpperCase();
  for (var i=0;i<SECURITY_GRANT.length;i++){
    if(SECURITY_GRANT[i] == request){
      result=true;
      break;
    }
  }
  if (  notifyUser && !result ){
    msg = "Access Violation (" + request + " is required)";
    if(caller) msg+=" from " + caller;
    briefNotify(msg ,"ERROR");

  }
  return result;
}



function securityshow(divIdToSecure){
  $(divIdToSecure).removeClass("SecurityDisabled");
}

function securityHide(divIdToSecure){
  $(divIdToSecure).addClass ("SecurityDisabled");
}

function securityLockForm(formName,lock){
  var disableStatus;
  if($("#"+formName).length==0) briefNotify("Attempt to Lockdown Empty Form:" + formName, "ERROR");
  if (lock == undefined)lock=true;

  $.each($("form#"+formName + "> input, >select"),function (ndx,field){
    if(lock)  $("form#"+formName +" #"+field.id).attr('disabled','disabled' );
    else $("form#"+formName +" #"+field.id).removeAttr('disabled');
  });
}

function isFormEmpty(formName){
  if ($("#"+formName+"-last_update").val()=="")return true;
  return false;
}







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

  setSelectOptions('#quickGolfScoreForm select[name=golfer_id]', GOLFER_CACHE);
  setSelectOptions('#securityUserForm select[name=securityProfileId]', SECURITY_PROFILE_CACHE);

  imposeGolferSecurityUIRestrictions();
  imposeGolfScoreSecurityUIRestrictions();
  imposeLauncherSecurityUIRestrictions();
  imposeGolfScoreSummarySecurityUIRestrictions();
  imposeSecurityUserSecurityUIRestrictions();
  imposeSecurityGrantsSecurityUIRestrictions();
  imposeQuickGolfScoreSecurityUIRestrictions();
}



function retrieveCache() {
  var params = prepParams (params, 'cross_table_cache', 'select');
  var successf = function (rslt) {
    onRefreshCache(rslt.rows);
  };
  serverCall(params, successf, FAILF);
}

//function getLbl4Val(val, type) {
//  var lbl;
//  if (type ==="golfer") { lbl=GOLFER_CACHE.val; 
//  }else if ( type=="") {
//  }else {
//    return "INVALID CACHE REQUESTED";
//  }
//  if (isEmpty(lbl) ) {
//    lbl ="--";
//  }
//  return lbl;
//}



//loginportal.js
<!--Begin LoginPortal-->



function loginCall(action) {
  var params = bindForm('LoginPortalForm');
  
    params['spwfResource'] = "security_user";
  params['spwfAction'] = action;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      var r = rslt.rows[0];
      if (r.session_id =="") {
        showDialog("Sorry, I Couldn't validate those Credentials");
        $("#password").val("");
      }else {
        statusMsg("Successfully Authenticated User : " + r.user_id );
        usrSessionId = r.session_id;
        usrLoginId = r.user_id;
        onSuccessfulLogin();
        if (rslt.spwfAction=="ONE_TIME") {
         showDialog("You just completed a one time logon.  You password has not been changed, please change your password for your next visit if you have forgotten it. ");
        }
      }
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  if (validateLoginPortalForm())serverCall(params, successf, FAILF);
}




function validateLoginPortalForm () {
  var formValid  = standardValidate('LoginPortalForm');
  if (($("#LoginPortalForm-password").val() == "" || $("#LoginPortalForm-password").val() == null ) &&$("#LoginPortalForm-password").is(" : visible")) {
    showDialog ("Please enter your password");
     formValid = false;
  }
  return formValid;
}

function onSuccessfulLogin() {
  $("#password").val("");
  displayMainLayout(true);
  $("#topMenuBar").show();
  registerAction();
  timeoutIfNoAction();
  changePage(function() {showLaunchPane()});
  retrieveCache();
}
function logOutUser() {
  usrSessionId="";
  usrLoginId="";
  $("#LoginPortalForm-user_id").val("");
  $("#LoginPortalForm-password").val("");
  displayMainLayout(false);
  $("#topMenuBar").hide();
  hideMainContent();
  return;
}


$(document).ready(function() {
    $("#LoginPortalForm-user_id").val("golfscore");
    $("#LoginPortalForm-password").val("golfscore");
    changePage(function() {showLoginPortal()});
    });

function showLoginPortal() {
  $(document).keypress(function(e) {
      if (e.keyCode == 13) {//enter
      loginCall('authenticate');
      }
      });

}
function initPasswordReset() {
  var params= {};
  params['user_id'] = $("#LoginPortalForm-user_id").val();
  if (params['user_id'] ==null || params['user_id'] =="") {
    showDialog("Please enter your User Id to initiate your password reset.");
    return false;
  }
  var successCallback = function(rslt) {
    if (rslt.success =="true") {
      showDialog("Your password reset is in process.  Do not close this page, but check your email for the code to enter to gain one-time access in order to change your password." );
    }
    prepForOneTimeEntry()
  
  };
  $.ajax( {type : "POST", url : passwordResetUrlTarget, dataType : "json", data : params, 
      success : successCallback, error : FAILF });
}

function initForgottenUserName() {
  
  showDialog("Please Enter your email address below.  Instructions will be mailed to this address.  <br/><input type='text' style='width : 400px;'size='90' id='forgottenUserIdEmail'/><br/> ", "300", "600", true, {"Ok" : function() {if ($("#forgottenUserIdEmail").val() !="") {emailUserName(); $( this ).dialog( "close" );} }, "Cancel" : function() {$( this ).dialog( "close" )}}, "Email User Name...");
     
}
//
function emailUserName() {
  var params= {};
  params['email_addr'] = $("#forgottenUserIdEmail").val();
  var successCallback = function(rslt) {
    if (rslt.success =="true") {
      showDialog("Your username has been mailed to your email address.  Do not close this page, but check your email for the username and reset code to enter to gain one-time access. You can change your password when you log in if desired" );
    }
    prepForOneTimeEntry()
  
  };
  $.ajax( {type : "POST", url : passwordResetUrlTarget, dataType : "json", data : params, 
      success : successCallback, error : FAILF });


}




function prepForOneTimeEntry() {
$("#LoginPortalForm-password_reset_codeDivId").show();
    $("#LoginPortalForm-passwordDivId").hide();
    $("#LoginPortalForm-password").val("");
    $("#cmdlogin").hide();
    $("#cmdOneTimelogin").show();

}

function onetimeLogin() {
  var params= {};
  params['user_id'] = $("#LoginPortalForm-user_id").val();
  params['password_reset_code'] = $("#LoginPortalForm-password_reset_code").val();
  if (params['user_id'] ==null || params['user_id'] =="" || params['password_reset_code'] ==null || params['password_reset_code'] =="") {
    showDialog("Please enter your User Id  and Password Reset Code to initiate your password reset.");
    return false;
  }
  var successCallback = function(rslt) {
    if (rslt.success =="true") {
      showDialog ("Your password reset is in process.  Do not close this page, but check your email for the code to enter to gain one-time access in order to change your password." );
    }
    $("#LoginPortalForm-password_reset_codeDivId").show();
    $("#cmdlogin").hide();
    $("#cmdOneTimelogin").show();

  };
  $.ajax( {type : "POST", url : passwordResetUrlTarget, dataType : "json", data : params, 
      success : successCallback, error : FAILF });
}




//LayoutComponents.js
function sizeLeftNav() {
  
    
    // document.getElementById('leftnav').style.height= (window.innerHeight-60) +"px";
    document.getElementById('mainContent').style.top="100px";
  document.getElementById('mainContent').style.left="0px";
  document.getElementById('mainContent').style.height=(window.innerHeight - 135 ) +"px";
  document.getElementById('mainContent').style.width=(window.innerWidth- 20 ) +"px";
}
function displayMainLayout(showHide) {
  var display = (showHide) ? "block" : "none";
  //document.getElementById('leftnav').style.display=display;
  document.getElementById('header').style.display=display;
  document.getElementById('footer').style.display=display;
  document.getElementById('mainContent').style.display=display;
  display = (showHide) ? "none" : "block";
  document.getElementById('LoginPortal').style.display=display;
  if (!showHide)showLoginPortal();
}

$(document).ready( function() {

    $.fn.dataTableExt.oStdClasses.sPagePrevDisabled =" smallButton LogicDisabled";
    $.fn.dataTableExt.oStdClasses.sPagePrevEnabled =" smallButton";
    $.fn.dataTableExt.oStdClasses.sPageNextDisabled =" smallButton LogicDisabled";
    $.fn.dataTableExt.oStdClasses.sPageNextEnabled =" smallButton";

    $.fn.dataTableExt.oStdClasses.sWrapper="prettyWrapper dataTables_wrapper";

    });

function showDialog(msg_, height_, width_, modal_, buttons_, title_) {
  $("#genericDialogDivId").dialog( "destroy" );

  msg_ =msg_ || "No message Defined";
  height_ = height_|| 300;
  width_=width_ || 400;
  modal_ = (modal_ === undefined) ? true : modal_;
  buttons_=buttons_|| {"Ok" : function() {$( this ).dialog( "close" );}};
  title_ = title_ || "";
  $("#genericDialogDivId").attr("title", title_);
  $("#dialogMsgSpanId").html(msg_);
  $("#genericDialogDivId").dialog(
       {
resizable : false, 
height : height_, 
width : width_, 
modal : modal_, 
buttons : buttons_
});
if (title_ ==="") {
  $("#genericDialogDivId").siblings(".ui-dialog-titlebar").hide();
}else {
  $("#genericDialogDivId").siblings(".ui-dialog-titlebar").show();

}

}


function briefNotify(msg, type) {
  var color;
  if (type== null || type=="INFO") {
    color="green";
  }else if (type=="WARNING") {
    color="yellow";
  }else if (type=="ERROR") {
    color="red";
  }else {
    color="black";
  }
  $("#briefNoticeMsg").css("border-color", color);
  $("#briefNoticeMsg").css("color", color);
  $("#briefNoticeMsg").html(msg);
  $('#briefNotice').fadeIn(300).delay(1500).fadeOut(400);
  statusMsg(msg);
}











function retrieveGolfScoreSummaryList() {
    if (!isUserAuthorized("SELECT_GOLFER_HANDICAP") ) {
      briefNotify("Access Violation", "ERROR");
      return false;
    }

    var params =prepParams(params, "golf_score_summary" , "select" );
    var successf = function (rslt) {
      if (!rslt[SERVER_SIDE_FAIL]) {
        populateGolfScoreSummaryListTable(rslt.rows);
      }else {
        briefNotify("There was a problem communicating with the Server.", "ERROR")
      }

    };
    var failf = function() {alert("failed");}
    serverCall(params, successf, failf);

  }
//var GolfScoreSummaryprKey = {};
function populateGolfScoreSummaryListTable(dataRows) {
  var dataArray= new Array();
  for(var ndx = 0; ndx<dataRows.length; ndx++) {
    dataArray[ndx] = buildGolfScoreSummaryListTableRow(dataRows[ndx]);
    //GolfScoreSummaryprKey[dataRows[ndx].] = ndx;
  }
  $('#golfScoreSummaryListTable').dataTable().fnClearTable();
  $('#golfScoreSummaryListTable').dataTable().fnAddData( dataArray, true );

}

function buildGolfScoreSummaryListTableRow(gs) {
  var dataHash= {};
  var links="";
  dataHash['golfer_name'] = gs.golfer_name;
  dataHash['handicap'] = formatNumber(gs.golf_score, 2, true, false, true);
  dataHash['date_range'] = pgDate(gs.first_date) + " - " + pgDate(gs.last_date);

  if (isUserAuthorized("SELECT_GOLF_SCORE")) {
    links+="<a class='alink' onclick='changePage(function() {showGolfScore(" +gs.golfer_id +")})'>View Scores</a>  ";
    links +="&nbsp; &nbsp;"
  }
  if (isUserAuthorized("SELECT_GOLFER")) {
    links +=" <a href='#' onclick='changePage(function() {showGolfer(" +gs.golfer_id +")})'>View Golfer</a>";
  }
  dataHash["links"] =links; 
  //dataHash["DT_RowId"] = "GolfScoreSummaryListTableTR-" + data.;

  return dataHash;

}

function showGolfScoreSummary() {
  statusMsg("Navigated to Golf Score Summary View ");
  retrieveGolfScoreSummaryList();
  standardShowContentPane("golfScoreSummary");
}

function imposeGolfScoreSummarySecurityUIRestrictions() {

}


//After complete Load setup
$(document).ready(function() {
    $("#golfScoreSummaryListTable").dataTable( 
       {
      "aoColumns" : [
       { "mData" : "golfer_name" }, 
       { "mData" : "handicap" }, 
       { "mData" : "date_range" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      });
    });













//Server Calls
function retrieveGolfScoreList(golferId_, selectedKey_) {
  if (!isUserAuthorized('SELECT_GOLF_SCORE') ) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }

  var params =prepParams(params, 'golf_score' , 'select' );
  params['where_clause'] = 'golfer_id =' + golferId_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      populateGolfScoreListTable(rslt.rows)
      
    } else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR');
    }
  };
  serverCall(params, successf, FAILF);
}
function retrieveGolfScore(params) {
  if (!isUserAuthorized('SELECT_GOLF_SCORE')) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }

  params = prepParams(params, 'golf_score', 'SELECT');
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
      bindToForm('golfScoreForm', rslt.rows[0]);
      toggleSaveMode('golfScoreForm', true);
    } else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  }
  serverCall(params, successf, FAILF);
}



function deleteGolfScore(golfScoreId_, lastUpdate_) {
  if (!isUserAuthorized('DELETE_GOLF_SCORE')) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }

  var params =prepParams(params, 'golf_score' , 'delete' );
  params['golf_score_id'] = golfScoreId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeGolfScoreListTableRow(rslt.golf_score_id);
      briefNotify('Golf Score Deleted Successfully', 'INFO');
    }else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  };
  serverCall(params, successf, FAILF);
}

function saveGolfScore(params) {
  if (!isUserAuthorized('UPDATE_GOLF_SCORE') && !isUserAuthorized('INSERT_GOLF_SCORE')) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }

  params = prepParams(params, 'golf_score', insertUpdateChoose);
  var successf=function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      if (rslt.spwfAction == "UPDATE") {
        replaceGolfScoreListTableRow(rslt.rows[0]);
      } else if (rslt.spwfAction == "INSERT") {
        addNewGolfScoreListTableRow(rslt.rows[0]);
      }
      briefNotify("Golf Score Successfully Saved", "INFO");
      var tempGolferId = $("#golfScoreForm-golfer_id").val();
      clearGolfScoreForm();
      $("#golfScoreForm-golfer_id").val(tempGolferId);

    } else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  };
  serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editGolfScore(golfScoreId_) {
  if (!isUserAuthorized('SELECT_GOLF_SCORE')) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }
  if (isUserAuthorized('UPDATE_GOLF_SCORE') ) {
    securityLockForm('golfScoreForm', false);
  } else {securityLockForm('golfScoreForm', true);}



  if (golfScoreId_) {
    var params = {'where_clause' : 'golf_score_id=' +golfScoreId_};
    retrieveGolfScore(params);
  }
}

function saveGolfScoreForm() {

  if (!isUserAuthorized('UPDATE_GOLF_SCORE') && !isUserAuthorized('INSERT_GOLF_SCORE')) {
    briefNotify("Access Violation", "ERROR");
    return false;
  }

  if (validateGolfScoreForm()) {
    var params = bindForm('golfScoreForm');
    saveGolfScore(params);
  }
}

//validation
function validateGolfScoreForm() {
  var formName = 'golfScoreForm';
  var formValid = standardValidate(formName);
  return formValid;
}

//Top Level HTML Manip
var GolfScoreprKey = {};
function populateGolfScoreListTable(dataRows) {
 var dataArray= new Array();
  for(var ndx = 0;ndx< dataRows.length;ndx++) {
    dataArray[ndx] = buildGolfScoreListTableRow(dataRows[ndx]);
    GolfScoreprKey[dataRows[ndx].golf_score_id] = ndx;

  }
  $('#golfScoreListTable').dataTable().fnClearTable();
  $('#golfScoreListTable').dataTable().fnAddData( dataArray, true );
  
}

function buildGolfScoreListTableRow(data) {
  var dataHash= {};
  var links ="";
  dataHash['golf_score'] = formatNumber(data.golf_score, 0, true, false, true) ;
  dataHash['game_dt'] =pgDate(data.game_dt)
    
  if (isUserAuthorized('UPDATE_GOLF_SCORE')) {
    links += "<a class='alink' onclick='editGolfScore(" +data.golf_score_id + ")'>Edit</a> ";
    links += "&nbsp; &nbsp;";
  } else if (isUserAuthorized("SELECT_GOLF_SCORE")) {
    links += "<a class='alink' onclick='editGolfScore(" +data.golf_score_id + ")'>View</a> ";
    links += '&nbsp; &nbsp;';

  }
  if (isUserAuthorized('DELETE_GOLF_SCORE')) {
    links += "<a class='alink' onclick=\"deleteGolfScore(" +data.golf_score_id + ", '"+data.last_update +"')\">Delete</a>  ";
    links +="&nbsp; &nbsp;"
  }

    dataHash["links"] =links; 
  dataHash["DT_RowId"] = "GolfScoreListTableTR-" + data.golf_score_id;
  return dataHash;
}

function replaceGolfScoreListTableRow(row) {
  $('#golfScoreListTable').dataTable().fnUpdate(buildGolfScoreListTableRow(row), GolfScoreprKey[row.golf_score_id] );
}
function addNewGolfScoreListTableRow(row) {
  $('#golfScoreListTable').dataTable().fnAddData(buildGolfScoreListTableRow(row));
}
function removeGolfScoreListTableRow(golfScoreId_) {
  $('#golfScoreListTable').dataTable().fnDeleteRow(GolfScoreprKey[golfScoreId_] );
}

//Div Access and App Layout Calls
function showGolfScore(golferId_) {
  if (!isUserAuthorized('SELECT_GOLF_SCORE', true, 'showGolfScore') ) return false; 
  statusMsg("Navigated to Golf Score View");
  retrieveGolfScoreList(golferId_); 
  retrieveGolferNameForGolfScore(golferId_);
  hideCurrentContentPane();
  $("#golfScore").fadeIn();
  currentContentPane="golfScore";
  if ( isFormEmpty('golfScoreForm')) toggleSaveMode('golfScoreForm', false);
  if ($("#golfScoreForm-golfer_id").val() !=golferId_) {
    clearGolfScoreForm();
  }
  $("#golfScoreForm-golfer_id").val(golferId_);
  $("#golfScoreGolferNameId").html(GOLFER_CACHE[golferId_] + " Golf Scores ");
  
  imposeGolfScoreSecurityUIRestrictions();
}


function clearGolfScoreForm() {
  var golferId=   $("#golfScoreForm-golfer_id").val();
  clearForm('golfScoreForm');
  $("#golfScoreForm-golfer_id").val(golferId);
  (isUserAuthorized('INSERT_GOLF_SCORE', false)) ? securityLockForm('golfScoreForm', false) : securityLockForm('golfScoreForm', true);
}

//After complete Load setup
$(document).ready(function() {
    $("#golfScoreForm-game_dt" ).datepicker();

    $("#golfScoreListTable").dataTable( {
      "aoColumns" : [
       { "mData" : "golf_score" }, 
       { "mData" : "game_dt" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      }
       );
    });


//page specific functions
function retrieveGolferNameForGolfScore(golferId_) {
  if (!isUserAuthorized("SELECT_GOLFER") ) {
    briefNotify("Access Violation", "ERROR");
    return false;
  }

  var params = prepParams(params, "GOLFER", "SELECT");
  params['where_clause'] = "golfer_id =" + golferId_;
  var successf = function(rslt) {
    $("#golfScoreGolferNameId").html(rslt.rows[0].name);
  }
  serverCall(params, successf, FAILF);
}

function imposeGolfScoreSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ='#golfScoreFormSave';
  (isUserAuthorized('UPDATE_GOLF_SCORE')) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#golfScoreFormAdd';
  (isUserAuthorized('INSERT_GOLF_SCORE')) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#golfScoreEntryDivId';
  (isUserAuthorized('UPDATE_GOLF_SCORE') || isUserAuthorized('INSERT_GOLF_SCORE') ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);
  if (!isUserAuthorized('INSERT_GOLF_SCORE') && !isUserAuthorized('UPDATE_GOLF_SCORE')) {
    securityLockForm('golfScoreForm', true);
  }
  if (!isUserAuthorized('INSERT_GOLF_SCORE', false) && isFormEmpty('golfScoreForm') ) {
    securityLockForm('golfScoreForm', true);
  }


}












//Server Calls
function retrieveQuickGolfScoreList() {
  if (!isUserAuthorized("SELECT_GOLF_SCORE", true, "retrieveQuickGolfScoreList") ) return false; 

  var params =prepParams(params, "golf_score" , "select" );
  params['orderby_clause'] =" order by game_dt desc"
    var successf = function (rslt) {
      if (!rslt[SERVER_SIDE_FAIL]) {
        populateQuickGolfScoreListTable(rslt.rows)
      }else {
        briefNotify("There was a problem communicating with the Server.", "ERROR");
      }
    };
  serverCall(params, successf, FAILF);
}
function retrieveQuickGolfScore(params) {
  if (!isUserAuthorized("SELECT_GOLF_SCORE", true, "retrieveQuickGolfScore" ) ) return false; 

  params = prepParams(params, "golf_score", "SELECT");
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
      bindToForm('quickGolfScoreForm', rslt.rows[0]);
      toggleSaveMode('quickGolfScoreForm', true);
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  }
  serverCall(params, successf, FAILF);
}



function deleteQuickGolfScore(golfScoreId_, lastUpdate_) {
  if (!isUserAuthorized("DELETE_GOLF_SCORE", true, "deleteQuickGolfScore" )) return false;


  var params =prepParams(params, "golf_score" , "delete" );
  params['golf_score_id'] = golfScoreId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeQuickGolfScoreListTableRow(rslt.golf_score_id);
      briefNotify("Golf Score Deleted Successfully", "INFO");
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

function saveQuickGolfScore(params) {
  if (!isUserAuthorized('UPDATE_GOLF_SCORE', false) && !isUserAuthorized('INSERT_GOLF_SCORE', false)) {
    briefNotify("Access Violation : saveQuickGolfScore ", "ERROR");
    return false;
  }

  params = prepParams(params, "golf_score", insertUpdateChoose);
  var successf=function(rslt) {
    clearForm('quickGolfScoreForm');
    if (!rslt[SERVER_SIDE_FAIL]) {
      if (rslt.spwfAction == "UPDATE") {
        replaceQuickGolfScoreListTableRow(rslt.rows[0]);
      }else if (rslt.spwfAction == "INSERT") {
        addNewQuickGolfScoreListTableRow(rslt.rows[0]);
      }
      briefNotify("Golf Score Successfully Saved", "INFO");
      clearQuickGolfScoreForm();

    }
    else {
      briefNotify("Golf Score Saved Failed", "ERROR");

    }
  };
  serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editQuickGolfScore(quickGolfScoreId_) {
  if ( !isUserAuthorized("SELECT_GOLF_SCORE", true, "editQuickGolfScore")) return false; 
  if (isUserAuthorized('UPDATE_GOLF_SCORE', false) ) {
    securityLockForm('quickGolfScoreForm', false);
  }else {securityLockForm('quickGolfScoreForm', true);}


  if (quickGolfScoreId_) {
    var params = {"where_clause" : "golf_score_id=" +quickGolfScoreId_};
    retrieveQuickGolfScore(params);
  }
}

function saveQuickGolfScoreForm() {
  if (!isUserAuthorized('UPDATE_GOLF_SCORE') && !isUserAuthorized("SELECT_GOLF_SCORE")) {
    briefNotify("Access Violation : save", "ERROR");
    return false;
  }

  if (validateQuickGolfScoreForm()) {
    var params = bindForm('quickGolfScoreForm');
    saveQuickGolfScore(params);
  }
}

//validation
function validateQuickGolfScoreForm() {
  var formName='quickGolfScoreForm';
  var formValid  = standardValidate(formName);
  return formValid;
}

//Top Level HTML Manip
var QuickGolfScoreprKey = {};
function populateQuickGolfScoreListTable(dataRows) {
  var dataArray= new Array();
  for(var ndx = 0;ndx< dataRows.length;ndx++) {
    dataArray[ndx] = buildQuickGolfScoreListTableRow(dataRows[ndx]);
    QuickGolfScoreprKey[dataRows[ndx].golf_score_id] = ndx;
  }
  $('#quickGolfScoreListTable').dataTable().fnClearTable();
  $('#quickGolfScoreListTable').dataTable().fnAddData( dataArray, true );
}

function buildQuickGolfScoreListTableRow(data) {
  var dataHash= {};
  var links ="";
  dataHash["golfer_name"] = GOLFER_CACHE[data.golfer_id];
  dataHash["golf_score"] = formatNumber(data.golf_score, 0, true, false, true);
  dataHash["game_dt"] = pgDate(data.game_dt);
  if (isUserAuthorized('UPDATE_GOLF_SCORE', false)) {
    links += "  <a class='alink' onclick='editQuickGolfScore(" +data.golf_score_id + ")'>Edit</a> ";
    links += " &nbsp; &nbsp ";
  }else if (isUserAuthorized("SELECT_GOLF_SCORE", false)) {
    links += "<a class='alink' onclick='editQuickGolfScore(" +data.golf_score_id + ")'>View</a> ";
    links += " &nbsp; &nbsp;";

  }

  if (isUserAuthorized("DELETE_GOLF_SCORE", false)) {
    links += "<a class='alink' onclick=\"deleteQuickGolfScore(" +data.golf_score_id + ", '"+data.last_update +"')\">Delete</a>  ";
  }
    dataHash["links"] =links; 
  dataHash["DT_RowId"] = "QuickGolfScoreListTableTR-" + data.golf_score_id;

  return dataHash;
}

function replaceQuickGolfScoreListTableRow(row) {
  $("#quickGolfScoreListTable").dataTable().fnUpdate(buildQuickGolfScoreListTableRow(row), QuickGolfScoreprKey[row.golf_score_id] );
}
function addNewQuickGolfScoreListTableRow(row) {
  $("#quickGolfScoreListTable").dataTable().fnAddData(buildQuickGolfScoreListTableRow(row));
}
function removeQuickGolfScoreListTableRow(golfScoreId_) {
  $("#quickGolfScoreListTable").dataTable().fnDeleteRow(QuickGolfScoreprKey[golfScoreId_] );
}

//Div Access and App Layout Calls
function showQuickGolfScore() {
  statusMsg("Navigated to Quick Golf Score Entry");
  retrieveQuickGolfScoreList(); 
  hideCurrentContentPane();
  $("#quickGolfScore").fadeIn();
  currentContentPane="quickGolfScore";
  if ( isFormEmpty('quickGolfScoreForm')) toggleSaveMode('quickGolfScoreForm', false);

}

function clearQuickGolfScoreForm() {
  clearForm('quickGolfScoreForm');
  (isUserAuthorized('INSERT_GOLF_SCORE', false)) ? securityLockForm('quickGolfScoreForm', false) : securityLockForm('quickGolfScoreForm', true);
}


//After complete Load setup
$(document).ready(function() {
    $("#quickGolfScoreForm-game_dt" ).datepicker();

    $("#quickGolfScoreListTable").dataTable( {
      "aoColumns" : [
       { "mData" : "golfer_name" }, 
       { "mData" : "golf_score" }, 
       { "mData" : "game_dt" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      }
       );
});

//page specific functions
function retrieveGolferNameForGolfScore(golferId_) {
  if (!isUserAuthorized("SELECT_GOLF_SCORE", true, "retrieveGolferNameForGolfScore" ) ) return false; 

  var params = prepParams(params, "GOLFER", "SELECT");
  params['where_clause'] = "golfer_id =" + golferId_;
  var successf = function(rslt) {
    $("#quickGolfScoreGolferNameId").html(rslt.rows[0].name);
  }
  serverCall(params, successf, FAILF);
}
function imposeQuickGolfScoreSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ='#quickGolfScoreFormSave';
  (isUserAuthorized('UPDATE_GOLF_SCORE', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#quickGolfScoreFormAdd';
  (isUserAuthorized('INSERT_GOLF_SCORE', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#quickGolfScoreEntryDivId';
  (isUserAuthorized('UPDATE_GOLF_SCORE', false) || isUserAuthorized('INSERT_GOLF_SCORE', false) ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  if (!isUserAuthorized('INSERT_GOLF_SCORE', false ) && !isUserAuthorized('UPDATE_GOLF_SCORE', false) ) {
    securityLockForm('quickGolfScoreForm', true);

  }
  if (!isUserAuthorized('INSERT_GOLF_SCORE', false) && isFormEmpty('quickGolfScoreForm') ) {
    securityLockForm('quickGolfScoreForm', true);
  }

}












//----------------------------------------------------

//server calls
function retrieveGolfer(params, selectedKey_) {
  if (!isUserAuthorized('SELECT_GOLFER', true, 'retrieveGolfer')) return false; 

  params = prepParams(params, 'golfer', 'SELECT');
  //params['spwfPagination']=true;
  if (selectedKey_) {
    params['passThru'] = "SELECTED_KEY~" + selectedKey_ + ';'
  }
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL])  {
      if (rslt.rowCount==1) {
        bindToForm('golferForm', rslt.rows[0]);
        toggleSaveMode('golferForm', true);
      }else {
        populateGolferListTable(rslt.rows, rslt.PT_SELECTED_KEY);
      }
    }else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  }
  serverCall(params, successf, FAILF);
}


function saveGolfer(params)  {
  if (!isUserAuthorized('UPDATE_GOLFER', false) && !isUserAuthorized('INSERT_GOLFER', false)) {
    briefNotify('Access Violation', 'ERROR');
    return false;
  }
  params = prepParams(params, 'golfer', insertUpdateChoose);
  var successf=function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      bindToForm('golferForm', rslt.rows[0]);
      if (rslt.spwfAction == 'UPDATE') {
        replaceRowGolferListTable(rslt.rows[0]);
      }else if (rslt.spwfAction == 'INSERT') {
        addNewRowGolferListTable(rslt.rows[0]);
      }
      briefNotify('Golfer Saved Successfully', 'INFO');
      clearGolferForm();
    }else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  };
  serverCall(params, successf, FAILF);
}



function deleteGolfer(golferId_, lastUpdate_) {
  if (!isUserAuthorized('DELETE_GOLFER', true, 'deleteGolfer' )) return false; 

  var params =prepParams(params, 'golfer' , 'delete' );
  params['golfer_id'] = golferId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeGolferListTableRow(rslt.golfer_id);
      briefNotify('Golfer Deleted Successfully', 'INFO');
    }else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR')
    }

  };
  serverCall(params, successf, FAILF);
}


//-----------------------
//Server Call Wrappers
function editGolfer(rowId_) {
  if ( !isUserAuthorized('SELECT_GOLFER', true, 'editGolfer') ) return false; 

  if (isUserAuthorized('UPDATE_GOLFER', false) ) {
    securityLockForm('golferForm', false);
  }else {securityLockForm('golferForm', true);}

  if (rowId_) {
    var params = {'where_clause' : 'golfer_id=' +rowId_};
    retrieveGolfer(params);
  }
}

function saveGolferForm() {
  if (!isUserAuthorized('UPDATE_GOLFER', false) && !isUserAuthorized('INSERT_GOLFER', false) ) {
    briefNotify('Access Violation saveGolferForm', 'ERROR');
    return false;
  }

  if (validateGolferForm()) {
    var params = bindForm('golferForm');
    saveGolfer(params);
  }else {
    briefNotify('Please Correct Form Validation Errors To Continue', 'WARNING');
  }
}

//validation
function validateGolferForm() {
  var formName='golferForm';
  var formValid  = standardValidate(formName);
  return formValid;
}

//----------------------------------------------------
//html building functions

var GolferprKey = {};
function populateGolferListTable(dataRows, selectedKey_) {
  var dataArray = new Array();
  for (var i=0; i<dataRows.length; i++) {
    dataArray[i] = buildGolferListTableRow(dataRows[i]);
    GolferprKey[dataRows[i].golfer_id] = i;
    if (dataRows[i].golfer_id == selectedKey_) {
      bindToForm('golferForm', dataRows[i]);
      toggleSaveMode('golferForm', true);
    }   
  }
  $('#golferListTable').dataTable().fnClearTable();
  $('#golferListTable').dataTable().fnAddData( dataArray, true );
}

function buildGolferListTableRow(data) {
  var dataHash = {};
  var htmlRow= "";
  dataHash["name"] = data.name;
  if (isUserAuthorized('UPDATE_GOLFER', false)) {
    htmlRow +="<a class='editGolferLink' onclick='editGolfer(";
    htmlRow +=data.golfer_id + ")'>Edit</a>";
    htmlRow +=" &nbsp; &nbsp; ";
  }else if (isUserAuthorized("SELECT_GOLFER", false)) {
    htmlRow += "<a class='alink' onclick='editGolfer(" +data.golfer_id + ")'>View</a> ";
    htmlRow += ' &nbsp; &nbsp;';
  }

  if (isUserAuthorized('DELETE_GOLFER', false)) {
    htmlRow +="<a href='#' class='deleteGolferLink' onclick=\"deleteGolfer(";
    htmlRow +=data.golfer_id + ", '" + data.last_update + "')\">Delete</a>";
  }
  dataHash['links'] = htmlRow;
  dataHash['DT_RowId'] = "GolferListTableTR-" + data.golfer_id;
  return dataHash;
}

function replaceRowGolferListTable(row) {
  $('#golferListTable').dataTable().fnUpdate(buildGolferListTableRow(row), GolferprKey[row.golfer_id] );
}
function addNewRowGolferListTable(row) {
  $('#golferListTable').dataTable().fnAddData(buildGolferListTableRow(row));
}
function removeGolferListTableRow(golferId_) {
  $('#golferListTable').dataTable().fnDeleteRow(GolferprKey[golferId_] );
}

function imposeGolferSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ='#golferFormSave';
  (isUserAuthorized('UPDATE_GOLFER', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#golferFormAdd';
  (isUserAuthorized('INSERT_GOLFER', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#golferEntryDivId';
  if (!isUserAuthorized('INSERT_GOLFER', false) && !isUserAuthorized('UPDATE_GOLFER', false)) {
    securityLockForm('golferForm', true);
  }
  if (!isUserAuthorized('INSERT_GOLFER', false) && isFormEmpty('golferForm') ) {
    securityLockForm('golferForm', true);
  }


}


//-------------------------------------------------
//Div Access and App Layout Calls
function showGolfer(golferId_) {
  statusMsg('Navigated to Golfer View');
  var params= {};
  hideCurrentContentPane();
  $('#golfer').fadeIn();
  currentContentPane = 'golfer';
  if (golferId_) {
    retrieveGolfer(params, golferId_);
  } else {
    if ( isFormEmpty('golferForm')) toggleSaveMode('golferForm', false);
    clearForm('golferForm');
    //retrieveGolferListTablePagination(1, PAGINATION_ROW_LIMIT);
    retrieveGolfer();
  }
  imposeGolferSecurityUIRestrictions();

}

function clearGolferForm() {
  clearForm('golferForm');
  (isUserAuthorized('INSERT_GOLFER', false)) ? securityLockForm('golferForm', false) : securityLockForm('golferForm', true);
}


$(document).ready(function() {
    $("#golferListTable").dataTable( {
      "aoColumns" : [
       { "mData" : "name" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      }
      );
    });




function showAboutPane() {
  hideCurrentContentPane();
  statusMsg("Navigated to About");
  $("#aboutPane").fadeIn();
  currentContentPane = "aboutPane";
  return "aboutPane";
}





  function showHelpPane() {
    statusMsg("Navigated to Help Portal");
    hideCurrentContentPane();
    $("#helpPane").fadeIn();
    currentContentPane = "helpPane";
    return "helpPane";
  }





function showLaunchPane() {
  statusMsg("Navigated to Main Portal");
  hideCurrentContentPane();
  $("#launchPane").fadeIn();
  currentContentPane = "launchPane";
  $(document).keypress(function(e) {
    //alert(e.which);
    switch(e.which) {
      case 103 : showSecurityGrants(); break;
      case 113 : showQuickGolfScore(); break;
      case 112 : showSecurityUser(); break;


    }
  });
  return "launchPane";
}
function imposeLauncherSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ="#launcherShowSecurityUserSpanId";
  (isUserAuthorized("SELECT_SECURITY_USER")) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ="#launcherShowViewAveragesSpanId";
  (isUserAuthorized("SELECT_GOLFER_HANDICAP")) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ="#launcherShowQuickEntrySpanId";
  (isUserAuthorized("SELECT_GOLF_SCORE")) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ="#launcherShowGrantsSpanId";
  (isUserAuthorized("SELECT_SECURITY_PROFILE") ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

}





function showClientLogViewer() {
  hideCurrentContentPane();
  statusMsg("Navigated to Log Viewer");
  var newHTML="";
  $("#clientLogViewer").fadeIn();
  $("ul#clientLogView").find("li").remove();
   logMsg("Log Viewed");
  for (var ndx=0; ndx<clientLog.length; ndx++){
  newHTML +="<li>"+ clientLog[ndx].logDt+"|" + clientLog[ndx].msg + "</li>";
  }
  $("ul#clientLogView").html(newHTML);
  currentContentPane="clientLogViewer";
}












//Server Calls
function retrieveSecurityGrantsList() {
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE") ) {
    briefNotify("Access Violation retrieveSecurityGrantsList" , "ERROR");
    return false;
  }

  var params =prepParams(params, "security_profile" , "select" );
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      populateSecurityGrantsListTable(rslt.rows);
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}
function retrieveSecurityGrants(params) {
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE") ) {
    briefNotify("Access Violation - retrieveSecurityGrants", "ERROR");
    return false;
  }

  params = prepParams(params, "security_profile", "SELECT");
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      bindToForm('securityGrantsForm', rslt.rows[0]);
      toggleSaveMode('securityGrantsForm', true);
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  }
  serverCall(params, successf, FAILF);
}



function deleteSecurityGrants(securityProfileId_, lastUpdate_) {
  if (!isUserAuthorized("DELETE_SECURITY_PROFILE") ) {
    briefNotify("Access Violation -  deleteSecurityGrants ", "ERROR");
    return false;
  }

  var params =prepParams(params, "security_profile" , "delete" );
  params['security_profile_id'] = securityProfileId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeSecurityGrantsListTableRow(rslt.security_profile_id);
      briefNotify("Golf Score Deleted Successfully", "INFO");
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

function saveSecurityGrants(params) {
  if (!isUserAuthorized('UPDATE_SECURITY_PROFILE') && !isUserAuthorized('INSERT_SECURITY_PROFILE')) {
    briefNotify("Access Violation - saveSecurityGrants ", "ERROR");
    return false;
  }

  params = prepParams(params, "security_profile", insertUpdateChoose);
  var successf=function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      clearForm('securityGrantsForm');
      if (rslt.spwfAction == "UPDATE") {
        replaceSecurityGrantsListTableRow(rslt.rows[0]);
      }else if (rslt.spwfAction == "INSERT") {
        addNewSecurityGrantsListTableRow(rslt.rows[0]);
      }
      briefNotify("Security Profile Successfully Saved");
      clearSecurityGrantsForm();

    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editSecurityGrants(securityGrantsId_) {
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE") ) {
    briefNotify("Access Violation - editSecurityGrants", "ERROR");
    return false;
  }

  if (isUserAuthorized('UPDATE_SECURITY_PROFILE') ) {
    securityLockForm('securityGrantsForm', false);
  }else {securityLockForm('securityGrantsForm', true);}

  $("#grantAssignDiv").removeClass("LogicDisabled");
  if (securityGrantsId_) {
    makeAvailableAllPrivileges();
    var params = {"where_clause" : "security_profile_id=" +securityGrantsId_};
    retrieveSecurityGrants(params);
    if (isUserAuthorized("SELECT_SECURITY_PROFILE_GRANT")) {
      retrieveAllGrantedPrivilegesList(securityGrantsId_);
    }
  }
}

function saveSecurityGrantsForm() {
  if (!isUserAuthorized('UPDATE_SECURITY_PROFILE') && !isUserAuthorized('INSERT_SECURITY_PROFILE')) {
    briefNotify("Access Violation  - saveSecurityGrantsForm", "ERROR");
    return false;
  }

  if (validateSecurityGrantsForm()) {
    var params = bindForm('securityGrantsForm');
    saveSecurityGrants(params);
  }
}

//validation
function validateSecurityGrantsForm() {
  var formName='securityGrantsForm';
  var formValid  = standardValidate(formName);
  return formValid;
}

//Top Level HTML Manip
var SecurityGrantsprKey = {};
function populateSecurityGrantsListTable(dataRows) {
  var dataArray= new Array();
  for(var ndx = 0;ndx< dataRows.length;ndx++) {
    dataArray[ndx] = buildSecurityGrantsListTableRow(dataRows[ndx]);
    SecurityGrantsprKey[dataRows[ndx].security_profile_id] = ndx;
  }
  $('#securityGrantsListTable').dataTable().fnClearTable();
  $('#securityGrantsListTable').dataTable().fnAddData( dataArray, true );


}

function buildSecurityGrantsListTableRow(data) {
  var dataHash= {};
  var links ="";
  dataHash["profile_name"] =data.profile_name;
  if (isUserAuthorized('UPDATE_SECURITY_PROFILE') ) {
    links += "<a class='alink' onclick='editSecurityGrants(" +data.security_profile_id + ")'>Edit</a> ";
    links += " &nbsp; &nbsp; ";
  }else if (isUserAuthorized("SELECT_SECURITY_PROFILE") ) {
    links += "<a class='alink' onclick='editSecurityGrants(" +data.security_profile_id + ")'>View</a> ";
    links += " &nbsp; &nbsp; ";
  }
  if (isUserAuthorized("DELETE_SECURITY_PROFILE")) {
    links += "<a class='alink' onclick=\"deleteSecurityGrants(" +data.security_profile_id + ", '"+data.last_update +"')\">Delete</a>";
  }
  dataHash["links"] =links; 
  dataHash["DT_RowId"] = "SecurityGrantsListTableTR-" + data.security_profile_id;

  return dataHash;
}

function replaceSecurityGrantsListTableRow(row) {
  $("#securityGrantsListTable").dataTable().fnUpdate(buildSecurityGrantsListTableRow(row), SecurityGrantsprKey[row.security_profile_id] );
}
function addNewSecurityGrantsListTableRow(row) {
  $("#securityGrantsListTable").dataTable().fnAddData(buildSecurityGrantsListTableRow(row));
}
function removeSecurityGrantsListTableRow(securityProfileId_) {
  $("#securityGrantsListTable").dataTable().fnDeleteRow(SecurityGrantsprKey[securityProfileId_] );
}

//Div Access and App Layout Calls
function showSecurityGrants() {
  statusMsg("Navigated to Security Grants");
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE") ) {
    briefNotify("Access Violation - showSecurityGrants", "ERROR");
    return false;
  }

  retrieveSecurityGrantsList(); 
  hideCurrentContentPane();
  $("#securityGrants").fadeIn();
  currentContentPane="securityGrants";
  if ( isFormEmpty('securityGrantsForm')) toggleSaveMode('securityGrantsForm', false);
  if (isUserAuthorized("SELECT_SECURITY_PRIVILEGE") ) {
    if ($("#securityGrantsForm-security_profile_id").val() =="") {
      retrieveAllAvailablePrivilegesList();
    }
  }
  if ($("#securityGrantsForm-security_profile_id").val() =="") {
    $("#grantAssignDiv").addClass("LogicDisabled");
  }

}

//After complete Load setup
$(document).ready(function() {
    $("#securityGrantsListTable").dataTable( {
      "aoColumns" : [
       { "mData" : "profile_name" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      }
      );



    $("#availableGrantsId").droppable( {accept : ".securityGrant", drop : handleSecurityRevokeDrop});
    $("#grantedPrivilegesId").droppable( {accept : ".securityGrant", drop : handleSecurityGrantDrop});

    });

//page specific functions
var allAvailablePrivilegeList;
function retrieveAllAvailablePrivilegesList() {
  if (!isUserAuthorized("SELECT_SECURITY_PRIVILEGE") ) {
    briefNotify("Access Violation - retrieveAllAvailablePrivilegesList", "ERROR");
    return false;
  }

  var params =prepParams(params, "security_privilege" , "select" );
  var successf = function (rslt) {
    allAvailablePrivilegeList = deepCopy(rslt.rows);
    populateAvailableGrantsWithAll();
  };
  serverCall(params, successf, FAILF);
}

function populateAvailableGrantsWithAll() {
  var newOptions="";
  for(var ndx = 0; ndx < allAvailablePrivilegeList.length;ndx++) {
    newOptions += '<div class="securityGrant" id="securityGrant'+allAvailablePrivilegeList[ndx].security_privilege_id+'Id"><span class="securityGrantName"> '+allAvailablePrivilegeList[ndx].priv_name  +'</span> <span class="securityGrantDescription">' +allAvailablePrivilegeList[ndx].description + '</span></div>';
  }

  $("#availableGrantsId").html(newOptions);
  if (isUserAuthorized("INSERT_SECURITY_PROFILE_GRANT") ) {
    makeDragable(".securityGrant");
  }
  $("#grantedPrivilegesId").children().remove();
}

function makeDragable(identifierTodraggable_) {
  if ( !isUserAuthorized("INSERT_SECURITY_PROFILE_GRANT")) {
    briefNotify("Access Violation - makeDragable", "ERROR");
    return false;
  }

  $(identifierTodraggable_).draggable( {snap : ".securityGrantReceiver", revert : "invalid", scroll : false, helper : 'clone' });
  if ($(identifierTodraggable_).parent().attr('id') === "availableGrantsId") {
    $(identifierTodraggable_).dblclick(function() {
        attemptSecurityGrantRevoke("GRANT", $(this).attr('id') );
        });
  }
}

function retrieveAllGrantedPrivilegesList(profileId_) {
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE_GRANT") ) {
    briefNotify("Access Violation  - retrieveAllGrantedPrivilegesList" , "ERROR");
    return false;
  }

  var params =prepParams(params, "security_profile_grant" , "select" );
  params["where_clause"] = "security_profile_id=" +profileId_;
  var successf = function (rslt) {
    var grants =  rslt.rows;
    for (var i =0; i< grants.length; i++) {
      assignGrantStatus("securityGrant"+ grants[i].security_privilege_id + "Id", "GRANT");
    }
    sortDivChildren("#grantedPrivilegesId");
  };
  serverCall(params, successf, FAILF);
}


function handleSecurityGrantDrop( event, ui ) {
  if (ui.draggable.parent().attr('id') !="grantedPrivilegesId")
    attemptSecurityGrantRevoke("GRANT", ui.draggable.attr('id'));
}
function handleSecurityRevokeDrop( event, ui ) {
  if (ui.draggable.parent().attr('id') !="availableGrantsId")
    attemptSecurityGrantRevoke("REVOKE", ui.draggable.attr('id'));
}

function attemptSecurityGrantRevoke(grantOrRevoke_, divId_) {
  if (!isUserAuthorized("DELETE_SECURITY_PROFILE_GRANT") ) {
    briefNotify("Access Violation - attemptSecurityGrantRevoke ", "ERROR");
    return false;
  }


  var profileId = $("#securityGrantsForm-security_profile_id").val();
  var privId = divId_.replace("securityGrant", "");
  privId = privId.replace("Id", "");
  if (!isEmpty(profileId)) {
    if (grantOrRevoke_ === "GRANT") {//grant requested
      assignGrantStatus(divId_, "GRANT");
      grantPrivilege(privId, profileId);
    }else {//default to revoke
      assignGrantStatus(divId_, "REVOKE");
      revokePrivilege(privId, profileId);
    }
  }else {// div is auto removed if not assignGrantsStatus above called
    briefNotify("Please choose a profile");
  }

}

function assignGrantStatus(grantDivId_, status_) {
  if (!isUserAuthorized("SELECT_SECURITY_PROFILE_GRANT") ) {
    briefNotify("Access Violation - assignGrantStatus", "ERROR");
    return false;
  }

  var fromLocation, toLocation;
  if (status_ == "GRANT") {fromLocation= "#availableGrantsId"; toLocation="#grantedPrivilegesId";
  } else {fromLocation= "#grantedPrivilegesId";toLocation="#availableGrantsId"; }
  fromLocation += " #"+grantDivId_;
  $(fromLocation).appendTo(toLocation);
  $(fromLocation).remove();
  if (isUserAuthorized("INSERT_SECURITY_PROFILE_GRANT") && isUserAuthorized("UPDATE_SECURITY_PROFILE_GRANT")) {
    makeDragable(toLocation + " #"+grantDivId_ );
  }
}

function grantPrivilege(securityPrivilegeId_, securityProfileId_) {
  if (!isUserAuthorized("INSERT_SECURITY_PROFILE_GRANT") ) {
    briefNotify("Access Violation -grantPrivilege ", "ERROR");
    return false;
  }

  var params =prepParams(params, "security_profile_grant" , "insert" );
  params['security_privilege_id'] = securityPrivilegeId_;
  params['security_profile_id'] = securityProfileId_;
  params['passThru'] ="pendingDiv~securityGrant" + securityPrivilegeId_ + "Id;";
  var successf = function (rslt) {
    if (!rslt['serverSideFail']) {
      briefNotify("Privilege Granted");
      sortDivChildren('#grantedPrivilegesId');
    }
    else { 
      briefNotify('There was a problem granting this privilege');
      assignGrantStatus(rslt['PT_pendingDiv'], "AVAIL");
    }
  };
  serverCall(params, successf, FAILF);
}

function revokePrivilege(securityPrivilegeId_, securityProfileId_) {
  if (!isUserAuthorized("DELETE_SECURITY_PROFILE") ) {
    briefNotify("Access Violation  - revokePrivilege" , "ERROR");
    return false;
  }

  var params =prepParams(params, "security_profile_grant" , "deletew" );
  params['where_clause'] = 'security_privilege_id=' + securityPrivilegeId_ + ' and security_profile_id = ' + securityProfileId_ ;
  params['passThru'] ="pendingDiv~securityGrant" + securityPrivilegeId_ + "Id;";
  var successf = function (rslt) {
    if (!rslt['serverSideFail']) {
      briefNotify("Privilege Revoked");
      sortDivChildren('#availableGrantsId');
    }else { 
      briefNotify('There was a problem granting this privilege');
      assignGrantStatus(rslt['PT_pendingDiv'], "GRANT");
    }

  };
  serverCall(params, successf, FAILF);
}

function makeAvailableAllPrivileges() {

  $('#grantedPrivilegesId').children().remove();
  $('#availableGrantsId').children().remove();
  populateAvailableGrantsWithAll();
  sortDivChildren("#availableGrantsId");


}
function sortDivChildren(divName_) {
  var children = $(divName_).children().sort(function (a, b) {
      var vA = $(a).attr('id');
      var vB = $(b).attr('id');
      return (vA < vB)  ?  -1 : (vA > vB)  ?  1 : 0;
      });
  $(divName_).children().remove();
  $(divName_).append(children);
  if (isUserAuthorized("INSERT_SECURITY_PROFILE_GRANT") ) {
    makeDragable(divName_ + " .securityGrant");
  }
}

function imposeSecurityGrantsSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ="#grantAssignDiv";
  (isUserAuthorized("SELECT_SECURITY_PROFILE_GRANT")) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#securityGrantsFormSave';
  (isUserAuthorized('UPDATE_SECURITY_PROFILE')) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#securityGrantsFormAdd';
  (isUserAuthorized('INSERT_SECURITY_PROFILE')) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#securityGrantsEntryDivId';
  (isUserAuthorized('UPDATE_SECURITY_PROFILE') || isUserAuthorized('INSERT_SECURITY_PROFILE') ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  if (!isUserAuthorized('INSERT_SECURITY_PROFILE') && !isUserAuthorized('UPDATE_SECURITY_PROFILE')) {
    securityLockForm('securityGrantsForm', true);
  }
  if (!isUserAuthorized('INSERT_SECURITY_PROFILE', false) && isFormEmpty('securityGrantsForm') ) {
    securityLockForm('securityGrantsForm', true);
  }




}
function clearSecurityGrantsForm() {
  clearForm('securityGrantsForm');
  makeAvailableAllPrivileges();
  $('#grantAssignDiv').addClass('LogicDisabled');
  if (isUserAuthorized('INSERT_SECURITY_PROFILE', false)) {
    securityshow('#securityGrantsFormAdd');
    securityLockForm('securityGrantsForm', false) 
  }else {
    securityHide('#securityGrantsFormAdd');
    securityLockForm('securityGrantsForm', true);
  }
}















//Server Calls
function retrieveSecurityUserList() {
  if (!isUserAuthorized("SELECT_SECURITY_USER", true, "retrieveSecurityUserList") ) return false; 

  var params =prepParams(params, "security_user" , "select" );
  var successf = function (rslt) {
    if (rslt[SERVER_SIDE_FAIL]) {
      briefNotify("There was a problem retrieving the User Listing", "ERROR");
    }else {
      populateSecurityUserListTable(rslt.rows);
    }

  };
  serverCall(params, successf, FAILF);
}
function retrieveSecurityUser(params) {
  if (!isUserAuthorized("SELECT_SECURITY_USER", true, "retrieveSecurityUser") ) return false; 

  params = prepParams(params, "security_user", "SELECT");
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      bindToForm('securityUserForm', rslt.rows[0]);
      document.getElementById("securityUserForm-edit_user_id").value=rslt.rows[0].user_id;
      if (rslt.rows[0].active_yn =="Y") {
        document.getElementById('securityUserForm-active_yn').checked=true;
      }else {
        document.getElementById('securityUserForm-active_yn').checked=false;
      }
      toggleSaveMode('securityUserForm', true);
      showPasswordFields(false);
    }else {
      briefNotify("There was a problem retrieving the User.", "ERROR");
    }
  }
  serverCall(params, successf, FAILF);
}



function deleteSecurityUser(securityUserId_, lastUpdate_) {
  if (!isUserAuthorized("DELETE_SECURITY_USER", true, "deleteSecurityUser") ) return false; 

  var params =prepParams(params, "security_user" , "delete" );
  params['security_user_id'] = securityUserId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeSecurityUserListTableRow(rslt.security_user_id);
      briefNotify("User Deleted Successfully", "INFO");
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

function saveSecurityUser(params) {
  if (!isUserAuthorized('UPDATE_SECURITY_USER', false) && !isUserAuthorized('INSERT_SECURITY_USER', false)) {
    briefNotify("Access Violation", "ERROR");
    return false;
  }

  params = prepParams(params, "security_user", insertUpdateChoose);
  var successf=function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {

      clearForm('securityUserForm');
      showPasswordFields(true);
      if (rslt.spwfAction == "UPDATE") {
        replaceSecurityUserListTableRow(rslt.rows[0]);
      }else if (rslt.spwfAction == "INSERT") {
        addNewSecurityUserListTableRow(rslt.rows[0]);
      }
      briefNotify("User Successfully Saved", "INFO");
      clearSecurityUserForm();

    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editSecurityUser(securityUserId_) {
  if (!isUserAuthorized("SELECT_SECURITY_USER", true, "editSecurityUser") ) return false; 
  if (isUserAuthorized('UPDATE_SECURITY_USER', false) ) {
    securityLockForm('securityUserForm', false);
  }else {securityLockForm('securityUserForm', true);}



  if (securityUserId_) {
    var params = {"where_clause" : "security_user_id=" +securityUserId_};
    retrieveSecurityUser(params);
  }
}

function saveSecurityUserForm() {
  if (!isUserAuthorized('UPDATE_SECURITY_USER', false) 
      && !isUserAuthorized('INSERT_SECURITY_USER', false)) {
    briefNotify("Access Violation : saveSecurityUserForm "  , "ERROR")
      return false;
  }

  if (validateSecurityUserForm()) {
    var params = bindForm('securityUserForm');
    if (document.getElementById('securityUserForm-active_yn').checked) {
      params['active_yn']='Y';
    }else {
      params['active_yn']='N';
    }
    saveSecurityUser(params);
  }
}

//validation
function validateSecurityUserForm() {
  var formName='securityUserForm';
  var formValid  = standardValidate(formName);
  if (document.getElementById('securityUserForm-password_enc').value != document.getElementById('securityUserForm-password_validate').value) {
    alert("Please ensure the passwords match to continue");
    formValid = false;
  }

  return formValid;
}

//Top Level HTML Manip
var SecurityUserprKey = {};
function populateSecurityUserListTable(dataRows) {
  var dataArray= new Array();
  if (dataRows !=null)
    for(var ndx = 0;ndx< dataRows.length;ndx++) {
      dataArray[ndx] = buildSecurityUserListTableRow(dataRows[ndx]);
      SecurityUserprKey[dataRows[ndx].security_user_id] = ndx;
    }
  $('#securityUserListTable').dataTable().fnClearTable();
  $('#securityUserListTable').dataTable().fnAddData( dataArray, true );
}

function buildSecurityUserListTableRow(data) {
  var dataHash= {};
  var links ="";
  dataHash["user_id"] = data.user_id;
  if (isUserAuthorized('UPDATE_SECURITY_USER', false) ) {
    links+= "<a class='alink' onclick='editSecurityUser(" +data.security_user_id + ")'>Edit</a> ";
    links+= " &nbsp; &nbsp;";
  }else if (isUserAuthorized("SELECT_SECURITY_USER", false)) {
    links+= "<a class='alink' onclick='editSecurityUser(" +data.security_user_id + ")'>View</a> ";
    links+= " &nbsp; &nbsp;";

  }
  if (isUserAuthorized("DELETE_SECURITY_USER", false)) {
    links+= "<a class='alink' onclick=\"deleteSecurityUser(" +data.security_user_id + ", '"+data.last_update +"')\">Delete</a>";
  }
  dataHash["links"] =links; 
  dataHash["DT_RowId"] = "SecurityUserListTableTR-" + data.security_user_id;

  return dataHash;
}

function replaceSecurityUserListTableRow(row) {
  $("#securityUserListTable").dataTable().fnUpdate(buildSecurityUserListTableRow(row), SecurityUserprKey[row.security_user_id] );
}
function addNewSecurityUserListTableRow(row) {
  $("#securityUserListTable").dataTable().fnAddData(buildSecurityUserListTableRow(row));
}
function removeSecurityUserListTableRow(securityUserId_) {
  $("#securityUserListTable").dataTable().fnDeleteRow(SecurityUserprKey[securityUserId_] );
}

//Div Access and App Layout Calls
function showSecurityUser() {
  statusMsg("Navigated to Security Users");
  if (!isUserAuthorized("SELECT_SECURITY_USER", true, "showSecurityUser" ) ) return false; 

  retrieveSecurityUserList(); 
  hideCurrentContentPane();
  $("#securityUser").fadeIn();
  currentContentPane="securityUser";
  if ( isFormEmpty('securityUserForm')) toggleSaveMode('securityUserForm', false);
  showPasswordFields(true);
}
function clearSecurityUserForm() {
  clearForm('securityUserForm');
  showPasswordFields(true);
  (isUserAuthorized('INSERT_SECURITY_USER', false)) ? securityLockForm('securityUserForm', false) : securityLockForm('securityUserForm', true);

}


//After complete Load setup
$(document).ready(function() {
    $("#securityUserListTable").dataTable( {
      "aoColumns" : [
       { "mData" : "user_id" }, 
       { "mData" : "links", asSorting : "none" }
      ], 
      "sPaginationType" : "two_button"
      }
      );

    });

//page specific functions

function showPasswordFields(show) {
  if (show) {
    $("#securityUserForm-password_encDivId").fadeIn();
    $("#securityUserForm-password_validateDivId").fadeIn();
  }else {
    $("#securityUserForm-password_encDivId").fadeOut();
    $("#securityUserForm-password_validateDivId").fadeOut();
  }
}
function initiateChangePassword() {
  showChangePasswordDialog($("#securityUserForm-edit_user_id").val());
}

function imposeSecurityUserSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ='#securityUserFormSave';
  (isUserAuthorized('UPDATE_SECURITY_USER', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#securityUserFormAdd';
  (isUserAuthorized('INSERT_SECURITY_USER', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#securityUserEntryDivId';
  (isUserAuthorized('UPDATE_SECURITY_USER', false) || isUserAuthorized('INSERT_SECURITY_USER', false) ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  if (!isUserAuthorized('INSERT_SECURITY_USER', false) && !isUserAuthorized('UPDATE_SECURITY_USER', false)) {
    securityLockForm('securityUserForm', true);
  }
  divIdToSecure ="#securityUserChangeOthersPassword";
  (isUserAuthorized("CHANGE_OTHERS_PWD", false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  if (!isUserAuthorized('INSERT_SECURITY_USER', false) && isFormEmpty('securityUserForm') ) {
    securityLockForm('securityUserForm', true);
  }



}





//----------------------------------------------------
//server calls
function submitChangePasswordDialog(params) {
  params = prepParams(params, "SECURITY_CHANGE_PASSWORD", 'CHANGE');
  var successf=function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {

      if (rslt.rows[0].change_password == '1') {
        briefNotify('Password Changed Successfully', 'INFO');
      }else {
        briefNotify('Password Change Fail', 'ERROR');
      }
    }else {
      briefNotify('Password Change Failed', 'ERROR');

    }
  };
  serverCall(params, successf, FAILF);
}

//-----------------------
//Server Call Wrappers

function submitChangePasswordDialogForm() {
  if (validateChangePasswordDialogForm()) {
    var params = bindForm('changePasswordDialogForm');
    clearForm('changePasswordDialogForm');
    submitChangePasswordDialog(params);
    $( "#changePasswordDialog" ).dialog( "close" );
  } else {
    briefNotify("Please Correct Form Validation Errors To Continue", "WARNING");
  }
}

//validation
function validateChangePasswordDialogForm() {
  var formName='changePasswordDialogForm';
  var formValid  = standardValidate(formName);
  if ($("#changePasswordDialogForm-new_password").val() !=$("#changePasswordDialogForm-confirm_password").val() ) {
    appendValidationMsg(formName, "changePasswordDialogForm-confirm_password", "Passwords do not match");
    highlightFieldError(formName, "changePasswordDialogForm-confirm_password", true);
    formValid =false;
  }
  return formValid;
}

//----------------------------------------------------
//html building functions


//-------------------------------------------------
//Div Access and App Layout Calls
function showChangePasswordDialog(userId_) {
  statusMsg("Navigated to Change Password Dialog");
  var params= {};
  if (userId_ == null) {
    userId_ =$("form#loginHolder #user_id").val() ;
  }
  $("#changePasswordDialogForm-user_to_update").val(userId_);
  $( "#changePasswordDialog" ).dialog( "destroy" );

  $( "#changePasswordDialog" ).dialog(
       {
resizable : false, 
height : 400, 
width : 600, 
modal : true, 
buttons : {
"Submit" : function() { submitChangePasswordDialogForm(); }, 
Cancel : function() { $( this ).dialog( "close" );clearForm('changePasswordDialogForm'); }
}
});


}

$(document).ready(function() {
    });













//Server Calls
function retrieveSupportRequestList() {
  if (!isUserAuthorized('SELECT_SUPPORT_REQUEST', true, 'retrieveSupportRequestList') ) return false; 

  var params =prepParams(params, 'support_request' , 'select' );
  //params['orderby_clause'] =" order by game_dt desc"
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      populateSupportRequestListTable(rslt.rows)
    }else {
      briefNotify('There was a problem communicating with the Server.', 'ERROR');
    }
  };
  serverCall(params, successf, FAILF);
}
function retrieveSupportRequest(params) {
  if (!isUserAuthorized("SELECT_SUPPORT_REQUEST", true, "retrieveSupportRequest" ) ) return false; 

  params = prepParams(params, "support_request", "SELECT");
  var successf = function(rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
      bindToForm('supportRequestForm', rslt.rows[0]);
      toggleSaveMode('supportRequestForm', true);
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  }
  serverCall(params, successf, FAILF);
}



function deleteSupportRequest(supportRequestId_, lastUpdate_) {
  if (!isUserAuthorized("DELETE_SUPPORT_REQUEST", true, "deleteSupportRequest" )) return false;
  var params =prepParams(params, "support_request" , "delete" );
  params['support_request_id'] = supportRequestId_;
  params['last_update'] = lastUpdate_;
  var successf = function (rslt) {
    if (!rslt[SERVER_SIDE_FAIL]) {
      removeSupportRequestListTableRow(rslt.support_request_id);
      briefNotify("Support Request Deleted Successfully", "INFO");
    }else {
      briefNotify("There was a problem communicating with the Server.", "ERROR")
    }

  };
  serverCall(params, successf, FAILF);
}

function saveSupportRequest(params) {
  if (!isUserAuthorized('UPDATE_SUPPORT_REQUEST', false) && !isUserAuthorized('INSERT_SUPPORT_REQUEST', false)) {
    briefNotify("Access Violation : saveSupportRequest ", "ERROR");
    return false;
  }

  params = prepParams(params, "support_request", insertUpdateChoose);
  var successf=function(rslt) {
    clearForm('supportRequestForm');
    if (!rslt[SERVER_SIDE_FAIL]) {
      if (rslt.spwfAction == "UPDATE") {
        replaceSupportRequestListTableRow(rslt.rows[0]);
      }else if (rslt.spwfAction == "INSERT") {
        addNewSupportRequestListTableRow(rslt.rows[0]);
      }
      briefNotify("Support Request Successfully Saved", "INFO");
      clearSupportRequestForm();

    }
    else {
      briefNotify("Support Request Score Saved Failed", "ERROR");

    }
  };
  serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function editSupportRequest(supportRequestId_) {
  showSupportRequestDialog();  
  if ( !isUserAuthorized("SELECT_SUPPORT_REQUEST", true, "editSupportRequest")) return false; 
  if (isUserAuthorized('UPDATE_SUPPORT_REQUEST', false) ) {
    securityLockForm('supportRequestForm', false);
  }else {securityLockForm('supportRequestForm', true);}




  if (supportRequestId_) {
    var params = {"where_clause" : "support_request_id=" +supportRequestId_};
    retrieveSupportRequest(params);
  }
}

function saveSupportRequestForm() {
  if (!isUserAuthorized('UPDATE_SUPPORT_REQUEST') && !isUserAuthorized("SELECT_SUPPORT_REQUEST")) {
    briefNotify("Access Violation : save Support Request", "ERROR");
    return false;
  }

  if (validateSupportRequestForm()) {
    $("#supportRequestFormHolder").dialog("close");
    var params = bindForm('supportRequestForm');
    saveSupportRequest(params);
  }
}

//validation
function validateSupportRequestForm() {
  var formName='supportRequestForm';
  var formValid  = standardValidate(formName);
  return formValid;
}

//Top Level HTML Manip
var SupportRequestprKey = {};
function populateSupportRequestListTable(dataRows) {
  var dataArray= new Array();
  for(var ndx = 0;ndx< dataRows.length;ndx++) {
    dataArray[ndx] = buildSupportRequestListTableRow(dataRows[ndx]);
    SupportRequestprKey[dataRows[ndx].support_request_id] = ndx;
  }
  $('#supportRequestListTable').dataTable().fnClearTable();
  $('#supportRequestListTable').dataTable().fnAddData( dataArray, true );
}

function buildSupportRequestListTableRow(data) {
  var dataHash= {};
  var links ="";
  dataHash["details"] = "<span class='sprite16Icon smallPlusIcon expanderClass'></span>" ;

  dataHash["support_request_id"] = data.support_request_id ;
  dataHash["summary"] =  data.summary;
  dataHash["detailed_description"] = data.detailed_description;
  dataHash["log_details"] = data.log_details;
  dataHash["solution_description"] = data.solution_description;
  dataHash["last_update"] = pgDate(data.last_update);
  dataHash["updated_by"] = data.updated_by;

  if (isUserAuthorized('UPDATE_SUPPORT_REQUEST', false)) {
    links += "  <a class='alink' onclick='editSupportRequest(" +data.support_request_id + ")'>Edit</a> ";
    links += " &nbsp; &nbsp ";
  }else if (isUserAuthorized("SELECT_SUPPORT_REQUEST", false)) {
    links += "<a class='alink' onclick='editSupportRequest(" +data.support_request_id + ")'>View</a> ";
    links += " &nbsp; &nbsp;";

  }

  if (isUserAuthorized("DELETE_SUPPORT_REQUEST", false)) {
    links += "<a class='alink' onclick=\"deleteSupportRequest(" +data.support_request_id + ", '"+data.last_update +"')\">Delete</a>  ";
  }
  dataHash["links"] =links; 
  dataHash["DT_RowId"] = "SupportRequestListTableTR-" + data.support_request_id;

  return dataHash;
}

function replaceSupportRequestListTableRow(row) {
  $("#supportRequestListTable").dataTable().fnUpdate(buildSupportRequestListTableRow(row), SupportRequestprKey[row.support_request_id] );
}
function addNewSupportRequestListTableRow(row) {
  $("#supportRequestListTable").dataTable().fnAddData(buildSupportRequestListTableRow(row));
}
function removeSupportRequestListTableRow(supportRequestId_) {
  $("#supportRequestListTable").dataTable().fnDeleteRow(SupportRequestprKey[supportRequestId_] );
}

//Div Access and App Layout Calls
function showSupportRequest() {
  statusMsg("Navigated to Support Request");
  retrieveSupportRequestList(); 
  hideCurrentContentPane();
  $("#supportRequest").fadeIn();
  currentContentPane="supportRequest";
  if ( isFormEmpty('supportRequestForm')) toggleSaveMode('supportRequestForm', false);

}

function clearSupportRequestForm() {
  $("#supportRequestFormHolder").dialog("close");
  clearForm('supportRequestForm');
  (isUserAuthorized('INSERT_SUPPORT_REQUEST', false)) ? securityLockForm('supportRequestForm', false) : securityLockForm('supportRequestForm', true);
}


//After complete Load setup
$(document).ready(function() {
  $("#supportRequestListTable").dataTable( {
    "aoColumns" : [
   { "mData" : "details" , bSortable : false, "sWidth" : "10"}, 
   { "mData" : "support_request_id", "sWidth" : "10" }, 
   { "mData" : "summary"  , "sClass" : "textAlignLeft"}, 
   { "mData" : "detailed_description", bVisible : false }, 
  // { "mData" : "log_details" }, 
  // { "mData" : "solution_description" }, 
   { "mData" : "last_update",  bVisible : false}, 
  // { "mData" : "updated_by" }, 
   { "mData" : "links", asSorting : "none", "sWidth" : "10em" }
  ], 
  "sPaginationType" : "two_button"
  }
  );


  $('#supportRequestListTable tbody td span.expanderClass').live('click', function () {
    var nTr = $(this).parents('tr')[0];
    var oTable = $("#supportRequestListTable").dataTable();
    if ( oTable.fnIsOpen(nTr) ) { /* This row is already open - close it */
      $(this).replaceWith( "<span class='sprite16Icon smallPlusIcon expanderClass'></span>") ;
      oTable.fnClose( nTr );
    }
    else { /* Open this row */
      $(this).replaceWith( "<span class='sprite16Icon smallCancelIcon expanderClass'></span>") ;
      oTable.fnOpen( nTr, fnFormatSupportRequestExpansion(oTable, nTr), 'details' );
    }
  } );


});




function fnFormatSupportRequestExpansion ( oTable, nTr )
 {
  var aData = oTable.fnGetData( nTr );
  var sOut = '<div style="padding-left : 50px;">';
  var divStyle= ""
    sOut += ''
    sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Detailed Description : </span><span>' + aData.detailed_description+'</span></div>';
  sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Solution Description : </span><span>' + aData.solution_description+'</span></div>';
  sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Log Details : </span><span>' + aData.log_details+'</span></div>';
  sOut +='';
  sOut += '</div>';
  //var sOut = "<span id='SupportRequestExpansion'></span>";  
  return sOut;
}
//page specific functions
function imposeSupportRequestSecurityUIRestrictions() {
  var divIdToSecure;
  divIdToSecure ='#supportRequestFormSave';
  (isUserAuthorized('UPDATE_SUPPORT_REQUEST', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#supportRequestFormAdd';
  (isUserAuthorized('INSERT_SUPPORT_REQUEST', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

  divIdToSecure ='#supportRequestEntryDivId';
  (isUserAuthorized('UPDATE_SUPPORT_REQUEST', false) || isUserAuthorized('INSERT_SUPPORT_REQUEST', false) ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);
  if (!isUserAuthorized('INSERT_SUPPORT_REQUEST', false ) && !isUserAuthorized('UPDATE_SUPPORT_REQUEST', false) ) {
    securityLockForm('supportRequestForm', true);

  }
  if (!isUserAuthorized('INSERT_SUPPORT_REQUEST', false) && isFormEmpty('supportRequestForm') ) {
    securityLockForm('supportRequestForm', true);
  }

}

function addNewSupportRequest() {
  var logText = '';
  clearSupportRequestForm();
  showSupportRequestDialog();
  for (var ndx = 0; ndx < clientLog.length; ndx++) {
    logText += clientLog[ndx].logDt + '|' + clientLog[ndx].msg + '\n';
  }

  $('#supportRequestForm-log_details').val(logText);

}
function showSupportRequestDialog() {
  $('#supportRequestFormHolder').dialog( {modal: true, width: '90%' });
}




function bodyOnLoad() {
  sizeLeftNav();
}

function bodyOnResize() {
  sizeLeftNav();
}


function changePage(strFuncCall_) {
  PAGE_CALLS.push(strFuncCall_);
  top.location.hash = '#' + VIEW_ID++;
}
$(window).bind('hashchange', function() {
    var id = window.location.hash.replace('#', '');
   if (id >= 0 && id < PAGE_CALLS.length) PAGE_CALLS[id]();
});

