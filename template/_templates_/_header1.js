"use strict";
//shared variables
var urlTarget = "/cgi-bin2/SimpleRespond.pl";
var usrSessionId="";
var usrLoginId="";

//Layout Functions
var currentContentPane="";
function bodyOnLoad(){
  sizeLeftNav();
}
function bodyOnResize(){
  sizeLeftNav();
}
[%+ test= "test"+%]

function sizeLeftNav(){[%test%]
  document.getElementById('leftnav').style.height= (window.innerHeight-60) +"px";
  document.getElementById('mainContent').style.top="25px";
  document.getElementById('mainContent').style.left="205px";
  document.getElementById('mainContent').style.height=(window.innerHeight-65) +"px";
 document.getElementById('mainContent').style.width=(window.innerWidth-230) +"px";
}
function displayMainLayout(showHide){
  var display = (showHide)?"block":"none";
  document.getElementById('leftnav').style.display=display;
  document.getElementById('header').style.display=display;
  document.getElementById('footer').style.display=display;
  document.getElementById('mainContent').style.display=display;
  display = (showHide)?"none":"block";
  document.getElementById('LoginPortal').style.display=display;

}
function setMainContentPane(divId){
  if(document.getElementById(currentContentPane)!= undefined){
	document.getElementById(currentContentPane).style.display="none";
  }
  document.getElementById(divId).style.display="block";
  currentContentPane = divId;

}

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
