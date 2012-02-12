"use strict";
//shared variables
var urlTarget = "/cgi-bin2/SimpleRespond.pl";
var usrSessionId="";
var usrLoginId="";
var usrLastAction= new Date();
var usrLogoutScheduled=false;
var usrTimeOutDuration = 20*60*1000;
var clientLog=new Array();


//validation functions
function isFieldIdEmpty(fieldId_){
  if (document.getElementById(fieldId_) == undefined) return true;
  if (document.getElementById(fieldId_).value == undefined) return true;
  if (document.getElementById(fieldId_).value == null) return true;
  if (document.getElementById(fieldId_).value == "") return true;
  return false;
}

function isValidOrNotifyFail(test_, fieldId_, msg_){
  if (!test_){ 
	$("label#" +fieldId_ +"_error").show();  
	$("label#" +fieldId_ +"_error").html($("label#" +fieldId_ +"_error").html() + " " + msg_  )  ;  
      	$("input#" +fieldId_).focus();  
  }
  return test_;
}

function validateServerResponse(responseTxt){
	if(responseTxt == undefined ||responseTxt==null ){
	  logMsg("validateServerResponse - undefined response");
	  return false;
	}
	if(responseTxt.errorMsg != undefined){
	   logMsg ("validateServerResponse - Error Msg: " + responseTxt.errorMsg);
	   return false;
	}
  return true;
}

function logMsg(msg){
  clientLog.push( String(msg) + "|"+ new Date());

}
function statusMsg(msg){
  $("#statusMsg").html(msg);
  logMsg("Console Msg:" +msg);
}
function extractDateFromPg(pgDate){
 return pgDate.substring(0,10);
}


// populates select list from array of items given as objects: { lbl: 'text', val: 'value' }
function populateSelect(el, items) {
  var optionString="<option value='0'>Please Select...</option>";
    $.each(items, function () {
    	optionString = optionString + "<option value='" + this.val +"'>" + this.lbl +"</option>";
	});
el.html(optionString);
}
[%#http://stackoverflow.com/questions/5263583/implement-a-back-button-warning-in-javascript-for-use-in-flex%]
window.onbeforeunload = function () {
   return "Are you sure you want to leave my glorious Flex app?"
}


$(document).ready(function(){
//	$("#user_id").val("golfscore");
//		$("input#password").val("golfscore");
});

var spwfService = new function(){
  this.ServiceHandles = new Array();
  this.register = function(name, ref){
	this.ServiceHandles[name]=ref;
  };
  this.exec = function(name, params){
//alert ("exec called");
	if(params == null){ params = {}; }
  	if(params['user_id'] == null)  params['user_id'] = usrLoginId;
	if(params['password'] == null) params['password'] = usrSessionId;
  	registerAction();
	this.ServiceHandles[name](params);
  }
};

