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
  location.reload(true);
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
	setMainContentPane(showGolfScoreSummary);
	cacheCtl.retrieveCache();
}

