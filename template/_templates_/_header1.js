"use strict";
//shared variables
var urlTarget = "/cgi-bin2/SimpleRespond.pl";
var usrSessionId="";
var usrLoginId="";
var usrLastAction= new Date();
var usrLogoutScheduled=false;
var usrTimeOutDuration = 20*60*1000;


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
	  //alert("Server Called Failed undefined response"); 
	  return false;
	}
	if(responseTxt.errorMsg != undefined){
	   //alert ("Server Error Msg: " + responseTxt.errorMsg);
	   return false;
	}
  return true;
}
function extractDateFromPg(pgDate){
 return pgDate.substring(0,10);
}

$(document).ready(function(){
	$('.error').hide();  
	$("#login_button").click(function(){
	  if(validateLoginForm()) {
		authenticateUser();
          }
	  return false;// don't actually submit	
}); 
	$("#user_id").val("golfscore");
	$("#password").val("golfscore");
$("logOutLink").click(logOutUser);
});
