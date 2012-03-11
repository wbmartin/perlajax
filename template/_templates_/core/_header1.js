"use strict";
//shared variables
var urlTarget = "/cgi-bin2/SimpleRespond.pl";
var usrSessionId="";
var usrLoginId="";
var usrLastAction= new Date();
var usrLogoutScheduled=false;
var usrTimeOutDuration = 20*60*1000;
var clientLog=new Array();
var insertUpdateChoose = "INSERTUPDATE";



//validation functions
function isFieldIdEmpty(fieldId_){
  if (document.getElementById(fieldId_) == undefined) return true;
  if (document.getElementById(fieldId_).value == undefined) return true;
  if (document.getElementById(fieldId_).value == null) return true;
  if (document.getElementById(fieldId_).value == "") return true;
  return false;
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
	  		//window.location.reload();
		}
	   logMsg ("validateServerResponse - Error Msg: " + responseTxt.errorMsg);
	   return false;
	}
  registerAction();
  return true;
}

function logMsg(msg){
  clientLog.push( String(msg) + "|"+ new Date());

}
function statusMsg(msg){
  $("#statusMsg").html(msg);
  logMsg("Console Msg:" +msg);
}


[%#http://stackoverflow.com/questions/5263583/implement-a-back-button-warning-in-javascript-for-use-in-flex%]
window.onbeforeunload = function () {
  if(usrSessionId !=""){
   return "If you click OK and continue to refresh this page, you will lose any data that has not been saved"
  }
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


// timeout function
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
function registerAction(){
  usrLastAction= new Date();
  usrLogoutScheduled = false;
}


function logOutUser(){
  usrSessionId="";
  usrLoginId="";
  loginPageCtl.loginForm.user_id="";
  loginPageCtl.loginForm.password="";
	displayMainLayout(false);
	$("#topMenuBar").hide();
	hideMainContent();

  return;
}

function digest(er, ee) {
    if (null == ee || "object" != typeof ee || null == er || "object" != typeof er ) return er;
    for (var attr in ee) {
        er[attr] = ee[attr];
    }
    return er;
}



var appModule = angular.module('AppModule', []);
appModule.filter('pgDate', function(){
   return function(pgDate){
      return pgDate.substring(0,10);
   }
});

appModule.filter('FormatNumber',function(){
	return function(num,decimalNum,bolLeadingZero,bolParens,bolCommas){
		return FormatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas);
	}
});

appModule.filter('lbl4Val',function(){
	return function(val,type){
	   return getLbl4Val(val,type);
	}
});

appModule.filter('golferNameFromId',function(){
	return function(id){
        if(typeof golfScoreCtl.golfers === 'undefined'){return "--";} 
	  for(var i=0;i<golfScoreCtl.golfers.length;i++){
		if(golfScoreCtl.golfers[i].val == id){
			return golfScoreCtl.golfers[i].lbl;

		}
	  }
	  return "**";
	}
});





function handleServerResponse(msg, startTime, data){
	if(!validateServerResponse(data)){
		alert("[%serverErrorMsg_Communication%]");
		return false
	}
	statusMsg( msg +" in " + (new Date().getTime()-startTime.getTime())/1000 + "s" );
	return true;
}


function onSuccessfulLogin(){
	$("#password").val("");
	displayMainLayout(true);
	$("#topMenuBar").show();
	registerAction();
	timeoutIfNoAction();
	showGolfScoreSummary();
	cacheCtl.retrieveCache();
}

function hideMainContent(){
 return "";
}


function FormatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas){ 
        if (isNaN(parseInt(num))) return "NaN";
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
		else tmpNumStr = "-" + tmpNumStr.substring(2,tmpNumStr.length);
		
	// See if we need to put in the commas
	if (bolCommas && (num >= 1000 || num <= -1000)) {
		var iStart = tmpNumStr.indexOf(".");
		if (iStart < 0)	iStart = tmpNumStr.length;

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

	return tmpNumStr.toString();		// Return our formatted string!
}

function filterCacheArrayByVal ( cacheArray, idToSet){
	for(var i=0;i<cacheArray.length;i++){
		if(cacheArray[i].val == idToSet)return cacheArray[i];
	}
	return {};
}

