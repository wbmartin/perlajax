[% divId = 'securityUser' %]
[% spwfResource = 'security_user' %]
[% prkey = 'security_user_id' %]
[% prettyName = 'User' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


//Server Calls
[% SRC_LOC = '_securityUserCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================

* @return {boolean} allowed.
*/
function retrieve[%ucfirst(divId)%]List() {
	if (!isUserAuthorized('[%SELECT_GRANT%]',
				true,
				'retrieve[%ucfirst(divId)%]List')) {
				 	return false;
			}

	var params = prepParams(params, '[%spwfResource%]' , 'select');
	var successf = function(rslt) {
		if (rslt[SERVER_SIDE_FAIL]) {
			briefNotify(
					'There was a problem retrieving the [%prettyName%] Listing',
					'ERROR'
					);
		}else {
			populate[%ucfirst(divId)%]ListTable(rslt.rows);
		}

	};
	serverCall(params, successf, FAILF);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} params ajax params.
* @return {boolean} allowed.
*/
function retrieve[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%SELECT_GRANT%]',
				true,
				'retrieve[%ucfirst(divId)%]')) {
				 	return false;
				}

	params = prepParams(params, '[%spwfResource%]', 'SELECT');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			bindToForm('[%divId%]Form', rslt.rows[0]);
			$('#[%divId%]Form-edit_user_id').val(rslt.rows[0].user_id);
			if (rslt.rows[0].active_yn == 'Y') {
				document.getElementById('[%divId%]Form-active_yn').checked = true;
			}else {
				document.getElementById('[%divId%]Form-active_yn').checked = false;
			}
			toggleSaveMode('[%divId%]Form', true);
			showPasswordFields(false);
		}else {
			briefNotify(
					'There was a problem retrieving the [%prettyName%].',
					'ERROR'
					);
		}
	};
	serverCall(params, successf, FAILF);
}



/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} [%toCC(prkey)%]_  prkey.
* @param {string} lastUpdate_  tran mgmt.
* @return {boolean} allowed.
*/
function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized('[%DELETE_GRANT%]',
				true,
				'delete[%ucfirst(divId)%]')) {
				 	return false;
				}

	var params = prepParams(params, '[%spwfResource%]' , 'delete');
	params['[%prkey%]'] = [%toCC(prkey)%]_;
	params['last_update'] = lastUpdate_;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			remove[%ucfirst(divId)%]ListTableRow(rslt.[%prkey%]);
			briefNotify('[%prettyName%] Deleted Successfully', 'INFO');
		}else {
			briefNotify('There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} params  ajax params.
* @return {booleam} allowed.
*/
function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) &&
			!isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	params = prepParams(params, '[%spwfResource%]', insertUpdateChoose);
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {

			clearForm('[%divId%]Form');
			showPasswordFields(true);
			if (rslt.spwfAction == 'UPDATE') {
				replace[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}else if (rslt.spwfAction == 'INSERT') {
				addNew[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}
			briefNotify('[%prettyName%] Successfully Saved',
					'INFO'
					);
			clear[%ucfirst(divId)%]Form();

		}else {
			briefNotify('There was a problem communicating with the Server.',
				 'ERROR'
				 );
		}

	};
	serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} [%divId%]Id_  prkey to edit.
* @return {boolean} allowed.
*/
function edit[%ucfirst(divId)%]([%divId%]Id_) {
	if (!isUserAuthorized('[%SELECT_GRANT%]',
				true,
				'edit[%ucfirst(divId)%]')) {
					return false;
				}
	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		securityLockForm('[%divId%]Form', false);
	}else {securityLockForm('[%divId%]Form', true);}



	if ([%divId%]Id_) {
		var params = {'where_clause': '[%prkey%]=' + [%divId%]Id_};
		retrieve[%ucfirst(divId)%](params);
	}
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {boolean} allowed.
*/
function save[%ucfirst(divId)%]Form() {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) &&
			!isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify('Access Violation: save[%ucfirst(divId)%]Form',
			 'ERROR'
			 );
			return false;
	}

	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
		if (document.getElementById('[%divId%]Form-active_yn').checked) {
			params['active_yn'] = 'Y';
		}else {
			params['active_yn'] = 'N';
		}
		save[%ucfirst(divId)%](params);
	}
}

//validation
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {boolean} validity.
*/
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	if (document.getElementById('[%divId%]Form-password_enc').value !=
			document.getElementById('[%divId%]Form-password_validate').value) {
		showDialog('Please ensure the passwords match to continue');
		formValid = false;
	}

	return formValid;
}

//Top Level HTML Manip
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} dataRows array of objects.
*/
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	var dataArray = new Array();
	if (dataRows != null)
		for (var ndx = 0; ndx < dataRows.length; ndx++) {
			dataArray[ndx] = build[%ucfirst(divId)%]ListTableRow(dataRows[ndx]);
		}
	$('#[%divId%]ListTable').dataTable().fnClearTable();
	$('#[%divId%]ListTable').dataTable().fnAddData(dataArray, true);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} data [%ucfirst(divId)%] info.
* @return {Object} built table row.
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash = {};
	var links = '';
	dataHash['user_id'] = data.user_id;
	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		links += '<a class = "alink" onclick = "edit[%ucfirst(divId)%](';
	 	links += data.[%prkey%] + ')">Edit</a> ';
		links += ' &nbsp; &nbsp;';
	}else if (isUserAuthorized('[%SELECT_GRANT%]', false)) {
		links += '<a class = "alink" onclick = "edit[%ucfirst(divId)%](';
	 	links += data.[%prkey%] + ')">View</a> ';
		links += ' &nbsp; &nbsp;';

	}
	if (isUserAuthorized('[%DELETE_GRANT%]', false)) {
		links += '<a class = "alink" onclick = "delete[%ucfirst(divId)%](';
		links += data.[%prkey%] + ', \'' + data.last_update;
		links += '\')">Delete</a>';
	}
	dataHash['links'] = links;
	dataHash['DT_RowId'] = '[%ucfirst(divId)%]ListTableTR-' + data.[%prkey%];

	return dataHash;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} row [%ucfirst(divId)%] info.
*/
function replace[%ucfirst(divId)%]ListTableRow(row) {
	$('#[%divId%]ListTable').dataTable().fnUpdate(
			build[%ucfirst(divId)%]ListTableRow(row),
			$('#[%ucfirst(divId)%]ListTableTR-' + row.[%prkey%])[0]
			);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} row [%ucfirst(divId)%] info.
*/
function addNew[%ucfirst(divId)%]ListTableRow(row) {
	$('#[%divId%]ListTable').dataTable().fnAddData(
			build[%ucfirst(divId)%]ListTableRow(row)
			);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} [%toCC(prkey)%]_ prkey.
*/
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
	$('#[%divId%]ListTable').dataTable().fnDeleteRow(
			$('#[%ucfirst(divId)%]ListTableTR-' + [%toCC(prkey)%]_)[0]
			);
}

//Div Access and App Layout Calls
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {boolean} allowed.
*/
function show[%ucfirst(divId)%]() {
	if (!isUserAuthorized('[%SELECT_GRANT%]',
			 true,
			 'show[%ucfirst(divId)%]')) {
				 return false;
			 }
	retrieve[%ucfirst(divId)%]List();
	standardShowContentPane('[%divId%]', 'Security Users');
	if (isFormEmpty('[%divId%]Form')) {
		toggleSaveMode('[%divId%]Form', false);
	}
	showPasswordFields(true);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function clear[%ucfirst(divId)%]Form() {
	clearForm('[%divId%]Form');
	showPasswordFields(true);
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityLockForm('[%divId%]Form', false) :
			securityLockForm('[%divId%]Form', true);

}

//page specific functions

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {boolean} show  show or not.
*/
function showPasswordFields(show) {
	if (show) {
		$('#[%divId%]Form-password_encDivId').fadeIn();
		$('#[%divId%]Form-password_validateDivId').fadeIn();
	}else {
		$('#[%divId%]Form-password_encDivId').fadeOut();
		$('#[%divId%]Form-password_validateDivId').fadeOut();
	}
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function initiateChangePassword() {
	showChangePasswordDialog($('#[%divId%]Form-edit_user_id').val());
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	var divIdToSecure;
	divIdToSecure = '#[%divId%]FormSave';
	(isUserAuthorized('[%UPDATE_GRANT%]', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]FormAdd';
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]EntryDivId';
	(isUserAuthorized('[%UPDATE_GRANT%]', false) ||
	 isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			!isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		securityLockForm('[%divId%]Form', true);
	}
	divIdToSecure = '#[%divId%]ChangeOthersPassword';
	(isUserAuthorized('CHANGE_OTHERS_PWD', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			isFormEmpty('[%divId%]Form')) {
		securityLockForm('[%divId%]Form', true);
	}
}
