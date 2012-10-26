<!--Begin LoginPortal-->
[%divId="LoginPortal"%]
[%spwfResource="security_user"%]

function loginCall(action){
	var params = bindForm("[%divId%]Form");
	[%#prepParams will not work here %]
		params['spwfResource'] = "security_user";
	params['spwfAction'] = action;
	var successf = function (rslt){
		if(!rslt[SERVER_SIDE_FAIL]){
			var r = rslt.rows[0];
			if(r.session_id ==""){
				showDialog("Sorry, I Couldn't validate those Credentials");
				$("#password").val("");
			}else{
				statusMsg("Successfully Authenticated User: " + r.user_id );
				usrSessionId = r.session_id;
				usrLoginId = r.user_id;
				onSuccessfulLogin();
				if(rslt.spwfAction=="ONE_TIME"){
				 showDialog("You just completed a one time logon.  You password has not been changed, please change your password for your next visit if you have forgotten it. ");
				}
			}
		}else{
			briefNotify("There was a problem communicating with the Server.","ERROR")
		}

	};
	if (validate[%divId%]Form())serverCall(params,successf,FAILF);
}




function validate[%divId%]Form (){
	var formValid  = standardValidate("[%divId%]Form");
	if (($("#[%divId%]Form-password").val() == "" || $("#[%divId%]Form-password").val() == null ) &&$("#[%divId%]Form-password").is(":visible")) {
		showDialog ("Please enter your password");
		 formValid = false;
	}
	return formValid;
}

function onSuccessfulLogin(){
	$("#password").val("");
	displayMainLayout(true);
	$("#topMenuBar").show();
	registerAction();
	timeoutIfNoAction();
	changePage(function(){showLaunchPane()});
	retrieveCache();
}
function logOutUser(){
	usrSessionId="";
	usrLoginId="";
	$("#[%divId%]Form-user_id").val("");
	$("#[%divId%]Form-password").val("");
	displayMainLayout(false);
	$("#topMenuBar").hide();
	hideMainContent();
	return;
}


$(document).ready(function(){
		$("#[%divId%]Form-user_id").val("golfscore");
		$("#[%divId%]Form-password").val("golfscore");
		changePage(function(){showLoginPortal()});
		});

function showLoginPortal(){
	$(document).keypress(function(e) {
			if(e.keyCode == 13) {//enter
			loginCall('authenticate');
			}
			});

}
function initPasswordReset(){
	var params={};
	params['user_id'] = $("#[%divId%]Form-user_id").val();
	if (params['user_id'] ==null ||params['user_id'] ==""){
		showDialog("Please enter your User Id to initiate your password reset.");
		return false;
	}
	var successCallback = function(rslt){
		if (rslt.success =="true"){
			showDialog("Your password reset is in process.  Do not close this page, but check your email for the code to enter to gain one-time access in order to change your password." );
		}
		prepForOneTimeEntry()
	
	};
	$.ajax({type: "POST", url: passwordResetUrlTarget, dataType: "json", data: params, 
			success: successCallback, error: FAILF });
}

function initForgottenUserName(){
	
	showDialog("Please Enter your email address below.  Instructions will be mailed to this address.  <br/><input type='text' style='width:400px;'size='90' id='forgottenUserIdEmail'/><br/> ","300", "600", true, {"Ok":function(){if($("#forgottenUserIdEmail").val() !=""){emailUserName(); $( this ).dialog( "close" );} },"Cancel": function(){$( this ).dialog( "close" )}}, "Email User Name...");
		 
}
//
function emailUserName(){
	var params={};
	params['email_addr'] = $("#forgottenUserIdEmail").val();
	var successCallback = function(rslt){
		if (rslt.success =="true"){
			showDialog("Your username has been mailed to your email address.  Do not close this page, but check your email for the username and reset code to enter to gain one-time access. You can change your password when you log in if desired" );
		}
		prepForOneTimeEntry()
	
	};
	$.ajax({type: "POST", url: passwordResetUrlTarget, dataType: "json", data: params, 
			success: successCallback, error: FAILF });


}




function prepForOneTimeEntry(){
$("#[%divId%]Form-password_reset_codeDivId").show();
		$("#[%divId%]Form-passwordDivId").hide();
		$("#[%divId%]Form-password").val("");
		$("#cmdlogin").hide();
		$("#cmdOneTimelogin").show();

}

function onetimeLogin(){
	var params={};
	params['user_id'] = $("#[%divId%]Form-user_id").val();
	params['password_reset_code'] = $("#[%divId%]Form-password_reset_code").val();
	if (params['user_id'] ==null ||params['user_id'] =="" || params['password_reset_code'] ==null ||params['password_reset_code'] ==""){
		showDialog("Please enter your User Id  and Password Reset Code to initiate your password reset.");
		return false;
	}
	var successCallback = function(rslt){
		if (rslt.success =="true"){
			showDialog ("Your password reset is in process.  Do not close this page, but check your email for the code to enter to gain one-time access in order to change your password." );
		}
		$("#[%divId%]Form-password_reset_codeDivId").show();
		$("#cmdlogin").hide();
		$("#cmdOneTimelogin").show();

	};
	$.ajax({type: "POST", url: passwordResetUrlTarget, dataType: "json", data: params, 
			success: successCallback, error: FAILF });
}



