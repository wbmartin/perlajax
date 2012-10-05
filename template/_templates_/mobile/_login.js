	//<![CDATA[
$(document).ready(function(){
		$("#[%divId%]Form-user_id").val("golfscore");
		$("#[%divId%]Form-password").val("golfscore");

});
function loginCall(action){
	var params = bindForm("[%divId%]Form");
	[%#prepParams will not work here %]
	params['spwfResource'] = "[%spwfResource%]";
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
	if (validate[%ucfirst(divId)%]Form())serverCall(params,successf,FAILF);
}

function validate[%ucfirst(divId)%]Form(){
return true;
}

function onSuccessfulLogin(){
$.mobile.changePage("#summaryDivId");
}
//]]>

