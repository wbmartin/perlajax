[% divId = 'changePasswordDialog' %]
[% spwfResource = 'security_user' %]
[% SRC_LOC = 'changePasswordDialogCommon'%]
/**
*
* SRC: [%SRC_LOC%]
* =====================================================================
* @param {Object} params ajax param.
*/

function submit[%ucfirst(divId)%](params) {
	params = prepParams(params, 'SECURITY_CHANGE_PASSWORD', 'CHANGE');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {

			if (rslt.rows[0].change_password == '1') {
				briefNotify('Password Changed Successfully', 'INFO');
			}else {
				briefNotify('Password Change Fail', 'ERROR');
			}
		}else {
			briefNotify('Password Change Failed', 'ERROR');

		}
	};
	serverCall(params, successf, FAILF);
}

//Server Call Wrappers
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/

function submit[%ucfirst(divId)%]Form() {
	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
		clearForm('[%divId%]Form');
		submit[%ucfirst(divId)%](params);
		$('#[%divId%]').dialog('close');
	} else {
		briefNotify(
				'Please Correct Form Validation Errors To Continue',
				'WARNING'
				);
	}
}

//validation
/**
*
* SRC: [%SRC_LOC%]
* =====================================================================
* @return {boolean} validity .
*/
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	if ($('#[%divId%]Form-new_password').val() !=
					$('#[%divId%]Form-confirm_password').val()) {
		appendValidationMsg(
				formName,
				'[%divId%]Form-confirm_password',
				'Passwords do not match'
				);
		highlightFieldError(formName,
				'[%divId%]Form-confirm_password',
				true
				);
		formValid = false;
	}
	return formValid;
}

//html building functions


//Div Access and App Layout Calls
/**
*
* SRC: [%SRC_LOC%]
* =====================================================================
* @param {string} userId_ user identifer.
*/
function show[%ucfirst(divId)%](userId_) {
	statusMsg('Navigated to Change Password Dialog');
	var params = {};
	if (userId_ == null) {
		userId_ = $('form#loginHolder #user_id').val();
	}
	$('#[%divId%]Form-user_to_update').val(userId_);
	if ($('#[%divId%]').is(':data(dialog)')) {
	  $('#[%divId%]').dialog('destroy');
	}

	$('#[%divId%]').dialog({
				resizable: false,
		height: 400,
		width: 600,
		modal: true,
		buttons: {
			'Submit': function() { submit[%ucfirst(divId)%]Form(); },
		Cancel: function() {
			$(this).dialog('close');clearForm('[%divId%]Form');
		}
		}
			});


}
