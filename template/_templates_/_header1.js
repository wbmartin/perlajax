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
function sizeLeftNav(){
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


//Login Functions

function validateLoginForm(){ "use strict";
        $('.error').hide(); 
        $('.error').html(""); 
	if( isValidOrNotifyFail(!isFieldIdEmpty("user_id"),"user_id","*Required")
	  & isValidOrNotifyFail(!isFieldIdEmpty("password"),"password","*Required")
	){
	  //alert("ok");
	  //displayMainLayout(true);
	  return true;
	}else{
	  //alert ("failed");
	  return false;
        }
}//end validateLoginForm();

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

function authenticateUser(){
"use strict";
  var startTime, stopTime;
  var params = {};
  params['spwfResource'] = "security_user";
  params['spwfAction'] = "authenticate";
  params['user_id'] = $("#user_id").val();
  params['password'] = $("#password").val();

  startTime= new Date();
    $.post(urlTarget,params, function(responseJSON){ 
		stopTime=new Date();
		if(!validateServerResponse(responseJSON)){
			alert("Sorry, I Couldn't validate those Credentials");
			 $("#password").val("");
			return false;
		}		
 		var r = responseJSON.rows[0];
		usrSessionId = r.session_id;
		usrLoginId = r.user_id;
		$("#password").val("");
		displayMainLayout(true);
		$("#statusMsg").html("Successfully Authenticated User in " + (stopTime.getTime()-startTime.getTime())/1000 + "s" );

            //alert("Response:\n" + r.session_id +"Delivered in "+(stopTime.getTime()-startTime.getTime())/1000);  
        });  
}

function logOutUser(){
  usrSessionId ="";
  usrLoginId="";
  displayMainLayout(false);
  location.reload(true);
return;
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
	$("#user_id").val("simpledemo");
	$("#password").val("simpledemo");
$("logOutLink").click(logOutUser);
});
 

