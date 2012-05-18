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
var FAILF = function(){alert("FAIL");}

//validation functions
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
  $("form#loginHolder #user_id").val("");
  $("form#loginHolder #password").val("");
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

function serverCall(params, successCallback, failCallback){
  var resourceActionInfo = "Server Call Resource: " + params['spwfResource'] + " Action: " + params['spwfAction'];
  params['requestId'] =logMsg(resourceActionInfo + " Started");
  var successCallbackMod = function(rslt){
	logMsg(resourceActionInfo + " Responded", rslt.requestId);
 	if(validateServerResponse(rslt)){
		successCallback(rslt);
	}else{
		logMsg(resourceActionInfo + " Failed to validate the server response");
	}	
  }
  $.ajax({type: "POST", url: urlTarget, dataType: "json", data: params, 
	  success: successCallbackMod, error: failCallback });

}


function appendValidationMsg(formId,fieldId, msg){
	var fullyQName = "form#"+formId+" #" + fieldId;
	if($("form#"+formId).find("#"+fieldId+"Error").attr("id")==undefined){
	   $(fullyQName).after("<span id='" +fieldId + "Error' class='ValidationMsg'></span>");
	}
	if( $(fullyQName+"Error").html().length ==0){
		$(fullyQName+"Error").append("*");
	}
	$(fullyQName+"Error").append(" " + msg);
	$(fullyQName).addClass("invalid");
}
function highlightFieldError(formId, fieldId, yesNo){
  var bordercolor="black";
  if  (yesNo) bordercolor="red"
  $("form#"+formId+" #"+fieldId).css("border-color:"+bordercolor);

}

function bindForm(formName){
  var rslt={};
  var fieldId="";
  $.each($("form#"+formName+" :input"), 
	function(key, field){
	  fieldId = field.id.replace(formName+"-","");
	  if(field.type != 'button') rslt[fieldId]= field.value
	});
  return rslt;
}

function bindToForm(formName, obj){
var fieldId="";
 $.each($("form#"+formName+" :input"), 
	function(key, field){
	  fieldId = field.id.replace(formName+"-","");
	  if(field.type != 'button')  field.value = obj[fieldId];
	});


}

function standardValidate(formName){
  var formValid = true;
  $.each($("form#"+formName + ".ValidationMsg"),function (ndx,span){
	span.innerHTML="";
  });
  $.each($("form#"+formName + ".invalid"),function (ndx,field){
	$("form#"+formName +" #"+field.id).removeClass("invalid");
  });
  $.each($("form#" +formName + " .required"),function (ndx,field){
	if(field.value == null || field.value==""){
	 appendValidationMsg(formName,field.id, "Required");
	 highlightFieldError(formName,field.id,true);
	 formValid =false;
	}
  });

return formValid;
}

function pgDate(val){
var rslt;
      if (val !=null){
	rslt = val.substring(5,7)+"/"+val.substring(8,10) +"/"+ val.substring(0,4);
      }else{
	rslt= "";
      }
  return rslt;
}





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
	retrieveCache();
}

function hideMainContent(){
 return "";
}


function formatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas){ 
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


function deepCopy(obj){
  return $.extend(true, [], obj);
}



function getLbl4Val(val, type){
  var lbl;
	if (type ==="golfer"){ lbl=GOLFER_CACHE.val; 
	}else if( type==""){
	}else{
		return "INVALID CACHE REQUESTED";
	}
	if (isEmpty(lbl) ){
	  lbl ="--";
	}
	return lbl;

}
function setSelectOptions(selectId, obj){
  var newhtml="<option value=''></option>";
  $.each(obj,function(key,val){
   newhtml += "<option value='" + key + "'>"+val +"</option>";
  });
  $(selectId).html(newhtml);

}

