"use strict";
//shared variables
var urlTarget = "cgi-bin/SimpleRespond.pl";
var usrSessionId="";
var usrLoginId="";
var usrLastAction= new Date();
var usrLogoutScheduled=false;
var usrTimeOutDuration = 20*60*1000;
var clientLog=new Array();
var insertUpdateChoose = "INSERTUPDATE";
var FAILF = function(){alert("FAIL");}
var currentContentPane="";
var SERVER_SIDE_FAIL ='serverSideFail';

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//Form Functions
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

function clearForm(formName){
  var fieldId="";
  $.each($("form#"+formName+" :input"), 
	function(key, field){
	  fieldId = field.id.replace(formName+"-","");
	  if (field.type == 'checkbox'){
	    field.checked=false;
	  }else if(field.type != 'button')  field.value = "";
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
function briefNotify(msg,type){
  var color;
  if (type== null || type=="INFO"){
    color="green";
  }else if (type=="WARNING"){
    color="yellow";
  }else if (type=="ERROR"){
    color="red";
  }else{
    color="black";
  }
  $("#briefNoticeMsg").css("border-color",color);
  $("#briefNoticeMsg").css("color",color);
  $("#briefNoticeMsg").html(msg);
  $('#briefNotice').fadeIn(300).delay(1500).fadeOut(400);
  statusMsg(msg);
}
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
	logMsg(resourceActionInfo + " Responded", rslt.requestId);
 	if(!validateServerResponse(rslt)){
		logMsg(resourceActionInfo + " Failed to validate the server response - " +  rslt['errorMsg']);
		rslt[SERVER_SIDE_FAIL] = true;
	}else{
		rslt[SERVER_SIDE_FAIL] = false;
	}	  
	successCallback(rslt);
  }
  $.ajax({type: "POST", url: urlTarget, dataType: "json", data: params, 
	  success: successCallbackMod, error: failCallback });

}

function handleServerResponse(msg, startTime, data){
	if(!validateServerResponse(data)){
		alert("[%serverErrorMsg_Communication%]");
		return false
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

function isUserAuthorized(request){
	var result= false;
	request = request.toUpperCase();
	for (var i=0;i<SECURITY_GRANT.length;i++){
		 if(SECURITY_GRANT[i] == request){
			result=true;
			break;
		 }
	}
 return result;
}
