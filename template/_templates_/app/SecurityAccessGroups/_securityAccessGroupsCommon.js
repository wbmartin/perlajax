[% divId = 'securityAccessGroups' %]
[% spwfResource = 'security_profile' %]
[% prkey = 'security_profile_id' %]
[% prettyName = 'Security Profile' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


//Server Calls
[% SRC_LOC = '_securityAccessGroupsCommon'%]
/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @return {boolean} allowed.
 */
function retrieve[%ucfirst(divId)%]List() {
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify(
				'Access Violation retrieve[%ucfirst(divId)%]List',
				'ERROR'
				);
		return false;
	}

	var params = prepParams(params, '[%spwfResource%]' , 'select');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			populate[%ucfirst(divId)%]ListTable(rslt.rows);
		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
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
 * @param {Object} params data.
 * @return {boolean} allowed.
 */
function retrieve[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify(
				'Access Violation - retrieve[%ucfirst(divId)%]',
				'ERROR');
		return false;
	}

	params = prepParams(params, '[%spwfResource%]', 'SELECT');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			bindToForm('[%divId%]Form', rslt.rows[0]);
			toggleSaveMode('[%divId%]Form', true);
		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
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
 * @param {integer} [%toCC(prkey)%]_ prkey.
 * @param {string} lastUpdate_ for transaction mgmt.
 * @return {boolean} allowed.
 */
function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized('[%DELETE_GRANT%]')) {
		briefNotify(
				'Access Violation -  delete[%ucfirst(divId)%] ',
				'ERROR'
				);
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
			briefNotify(
					'There was a problem communicating with the Server.',
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
 * @param {Object} params data.
 * @return {boolean} allowed.
 */
function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]') &&
			!isUserAuthorized('[%INSERT_GRANT%]')) {
				briefNotify(
						'Access Violation - save[%ucfirst(divId)%] ',
						'ERROR'
						);
				return false;
			}

	params = prepParams(params, '[%spwfResource%]', insertUpdateChoose);
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			clearForm('[%divId%]Form');
			if (rslt.spwfAction == 'UPDATE') {
				replace[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}else if (rslt.spwfAction == 'INSERT') {
				addNew[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}
			briefNotify('[%prettyName%] Successfully Saved');
			clear[%ucfirst(divId)%]Form();

		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR');
		}

	};
	serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {integer} [%divId%]Id_ prkey.
 * @return {boolean} allowed.
 */
function edit[%ucfirst(divId)%]([%divId%]Id_) {
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify(
				'Access Violation - edit[%ucfirst(divId)%]',
				'ERROR'
				);
		return false;
	}

	if (isUserAuthorized('[%UPDATE_GRANT%]')) {
		securityLockForm('[%divId%]Form', false);
	}else {securityLockForm('[%divId%]Form', true);}

	$('#grantAssignDiv').removeClass('LogicDisabled');
	if ([%divId%]Id_) {
		makeAvailableAllPrivileges();
		var params = {'where_clause' : 
			'[%prkey%]='	+ [%divId%]Id_};
		retrieve[%ucfirst(divId)%](params);
		if (isUserAuthorized('SELECT_SECURITY_PROFILE_GRANT')) {
			retrieveAllGrantedPrivilegesList([%divId%]Id_);
		}
	}
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @return {boolean} allowed.
 */
function save[%ucfirst(divId)%]Form() {
	if (!isUserAuthorized('[%UPDATE_GRANT%]') &&
			!isUserAuthorized('[%INSERT_GRANT%]')) {
				briefNotify('Access Violation  - save[%ucfirst(divId)%]Form',
						'ERROR'
						);
				return false;
			}

	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
		save[%ucfirst(divId)%](params);
	}


	//validation
	/**
	 *
	 * SRC: [%SRC_LOC%]
	 *=====================================================================
	 * @return {boolean}  validity.
	 */
}
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	return formValid;
}

//Top Level HTML Manip
/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {Object} dataRows array of [%ucfirst(divId)%] objects.
 */
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	var dataArray = new Array();
	for (var ndx = 0; ndx < dataRows.length; ndx++) {
		dataArray[ndx] = build[%ucfirst(divId)%]ListTableRow(dataRows[ndx]);
	}
	$('#[%divId%]ListTable').dataTable().fnClearTable();
	$('#[%divId%]ListTable').dataTable().fnAddData(dataArray, true);
}

/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {Object} data [%ucfirst(divId)%] info.
 * @return {Object}  datatable row.
 */
function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash = {};
	var links = '';
	dataHash['profile_name'] = data.profile_name;
	if (isUserAuthorized('[%UPDATE_GRANT%]')) {
		links += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
		links += data.[%prkey%] + ')">Edit</a> ';
		links += ' &nbsp; &nbsp; ';
	}else if (isUserAuthorized('[%SELECT_GRANT%]')) {
		links += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
		links += data.[%prkey%] + ')">View</a>';
		links += ' &nbsp; &nbsp; ';
	}
	if (isUserAuthorized('[%DELETE_GRANT%]')) {
		links += '<a class="alink" onclick="delete[%ucfirst(divId)%](';
		links += data.[%prkey%] + ', \'' + data.last_update;
		links += '\')">Delete</a>';
	}
	dataHash['links'] = links;
	dataHash['DT_RowId'] = '[%ucfirst(divId)%]ListTableTR-';
	dataHash['DT_RowId'] += data.[%prkey%];

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
 *=====================================================================a
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
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify(
				'Access Violation - show[%ucfirst(divId)%]',
				'ERROR'
				);
		return false;
	}
	retrieve[%ucfirst(divId)%]List();
	standardShowContentPane('[%divId%]', 'Security Grants');
	if (isFormEmpty('[%divId%]Form')) {
		toggleSaveMode('[%divId%]Form', false);
	}
	if (isUserAuthorized('SELECT_SECURITY_PRIVILEGE')) {
		if ($('#[%divId%]Form-[%prkey%]').val() == '') {
			retrieveAllAvailablePrivilegesList();
		}
	}
	if ($('#[%divId%]Form-[%prkey%]').val() == '') {
		$('#grantAssignDiv').addClass('LogicDisabled');
	}

}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @return {boolean} allowed.
 */
function showSecurityGrantsAssignmentDialog() {
	if (isEmpty($('#[%divId%]Form-[%prkey%]').val())) {
		showDialog('Please select a Profile to continue.'); 
		return false;
	}
	_gaq.push(['_trackPageview',[%divId%]]);
	$('#grantAssignDiv').dialog({
		resizable: false,
	title: 'Double Click or drag privileges.',
	height: $(window).height() * .9,
	width: $(window).width() * .9,
	modal: true,
	buttons: {

		'Finished': function() {
			$(this).dialog('close');
		}
	}
	});
}


//page specific functions
var allAvailablePrivilegeList;
/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @return {boolean} allowed.
 */
function retrieveAllAvailablePrivilegesList() {
	if (!isUserAuthorized('SELECT_SECURITY_PRIVILEGE')) {
		briefNotify(
				'Access Violation - retrieveAllAvailablePrivilegesList',
				'ERROR'
				);
		return false;
	}

	var params = prepParams(params, 'security_privilege' , 'select');
	var successf = function(rslt) {
		allAvailablePrivilegeList = deepCopy(rslt.rows);
		populateAvailableGrantsWithAll();
	};
	serverCall(params, successf, FAILF);
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function populateAvailableGrantsWithAll() {
	var newOptions = '';
	for (var ndx = 0; ndx < allAvailablePrivilegeList.length; ndx++) {
		newOptions += '<div class="securityGrant" id="securityGrant';
		newOptions += allAvailablePrivilegeList[ndx].security_privilege_id;
		newOptions += 'Id")"><span class="securityGrantName"> ';
		newOptions += allAvailablePrivilegeList[ndx].priv_name;
		newOptions += '</span> <span class="securityGrantDescription">';
		newOptions += allAvailablePrivilegeList[ndx].description + '</span></div>';
	}

	$('#availableGrantsId').html(newOptions);
	if (isUserAuthorized('INSERT_SECURITY_PROFILE_GRANT')) {
		makeDragable('.securityGrant');
	}
	$('#grantedPrivilegesId').children().remove();
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} identifierTodraggable_  div id.
 * @return {boolean} allowed.
 */
function makeDragable(identifierTodraggable_) {
	if (!isUserAuthorized('INSERT_SECURITY_PROFILE_GRANT')) {
		briefNotify('Access Violation - makeDragable', 'ERROR');
		return false;
	}

	$(identifierTodraggable_).draggable({
		snap: '.securityGrantReceiver',
	revert: 'invalid',
	scroll: false,
	helper: 'clone'
	});
	$(identifierTodraggable_).dblclick(function() {
		attemptSecurityGrantRevoke('SWAP', $(this).attr('id'));
	});
}

/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {integer} profileId_ prkey.
 * @return {boolean} allowed.
 */
function retrieveAllGrantedPrivilegesList(profileId_) {
	if (!isUserAuthorized('SELECT_SECURITY_PROFILE_GRANT')) {
		briefNotify(
				'Access Violation  - retrieveAllGrantedPrivilegesList',
				'ERROR'
				);
		return false;
	}

	var params = prepParams(params, 'security_profile_grant' , 'select');
	params['where_clause'] = 'security_profile_id=' + profileId_;
	var successf = function(rslt) {
		var grants = rslt.rows;
		for (var i = 0; i < grants.length; i++) {
			assignGrantStatus(
					'securityGrant' + grants[i].security_privilege_id + 'Id',
					'GRANT'
					);
		}
		sortDivChildren('#grantedPrivilegesId');
	};
	serverCall(params, successf, FAILF);
}


/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {Object} event unknown.
 * @param {Object} ui  dom element.
 */
function handleSecurityGrantDrop(event, ui) {
	if (ui.draggable.parent().attr('id') != 'grantedPrivilegesId')
		attemptSecurityGrantRevoke('GRANT', ui.draggable.attr('id'));
}
/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {Object} event unknown.
 * @param {Object} ui  dom element.
 */
function handleSecurityRevokeDrop(event, ui) {
	if (ui.draggable.parent().attr('id') != 'availableGrantsId')
		attemptSecurityGrantRevoke('REVOKE', ui.draggable.attr('id'));
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} grantOrRevoke_  GRANT or REVOKE.
 * @param {string} divId_ div.
 * @return {boolean} allowed.
 */
function attemptSecurityGrantRevoke(grantOrRevoke_, divId_) {
	if (!isUserAuthorized('DELETE_SECURITY_PROFILE_GRANT')) {
		briefNotify(
				'Access Violation - attemptSecurityGrantRevoke ',
				'ERROR'
				);
		return false;
	}
	if (grantOrRevoke_ === 'SWAP' &&
			$('#' + divId_).parent().attr('id') === 'availableGrantsId') {
				grantOrRevoke_ = 'GRANT';
			} else {
				grantOrRevoke_ = 'REVOKE';
			}


	var profileId = $('#[%divId%]Form-[%prkey%]').val();
	var privId = divId_.replace('securityGrant', '');
	privId = privId.replace('Id', '');
	if (!isEmpty(profileId)) {
		if (grantOrRevoke_ === 'GRANT') {//grant requested
			assignGrantStatus(divId_, 'GRANT');
			grantPrivilege(privId, profileId);
		}else {//default to revoke
			assignGrantStatus(divId_, 'REVOKE');
			revokePrivilege(privId, profileId);
		}
	}else {// div is auto removed if not assignGrantsStatus above called
		briefNotify('Please choose a profile');
	}

}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} grantDivId_ div.
 * @param {string} status_ GRANT or REVOKE.
 * @return {boolean} allowed.
 */
function assignGrantStatus(grantDivId_, status_) {
	if (!isUserAuthorized('SELECT_SECURITY_PROFILE_GRANT')) {
		briefNotify('Access Violation - assignGrantStatus', 'ERROR');
		return false;
	}

	var fromLocation, toLocation;
	if (status_ == 'GRANT') {
		fromLocation = '#availableGrantsId';
		toLocation = '#grantedPrivilegesId';
	} else {
		fromLocation = '#grantedPrivilegesId';
		toLocation = '#availableGrantsId';
	}
	fromLocation += ' #' + grantDivId_;
	$(fromLocation).appendTo(toLocation);
	$(fromLocation).remove();
	if (isUserAuthorized('INSERT_SECURITY_PROFILE_GRANT') &&
			isUserAuthorized('UPDATE_SECURITY_PROFILE_GRANT')) {
				makeDragable(toLocation + ' #' + grantDivId_);
			}
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {integer} securityPrivilegeId_ priv id.
 * @param {integer} securityProfileId_  profile id.
 * @return {boolean} allowed.
 */
function grantPrivilege(securityPrivilegeId_, securityProfileId_) {
	if (!isUserAuthorized('INSERT_SECURITY_PROFILE_GRANT')) {
		briefNotify('Access Violation -grantPrivilege ', 'ERROR');
		return false;
	}

	var params = prepParams(params, 'security_profile_grant', 'insert');
	params['security_privilege_id'] = securityPrivilegeId_;
	params['security_profile_id'] = securityProfileId_;
	params['passThru'] = 'pendingDiv~securityGrant';
	params['passThru'] += securityPrivilegeId_ + 'Id;';
	var successf = function(rslt) {
		if (!rslt['serverSideFail']) {
			briefNotify('Privilege Granted');
			sortDivChildren('#grantedPrivilegesId');
		}
		else {
			briefNotify('There was a problem granting this privilege');
			assignGrantStatus(rslt['PT_pendingDiv'], 'AVAIL');
		}
	};
	serverCall(params, successf, FAILF);
}

/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {integer} securityPrivilegeId_ priv id.
 * @param {integer} securityProfileId_  profile id.
 * @return {boolean} allowed.
 */
function revokePrivilege(securityPrivilegeId_, securityProfileId_) {
	if (!isUserAuthorized('[%DELETE_GRANT%]')) {
		briefNotify('Access Violation  - revokePrivilege' , 'ERROR');
		return false;
	}

	var params = prepParams(params, 'security_profile_grant', 'deletew');
	params['where_clause'] = 'security_privilege_id=';
	params['where_clause'] += securityPrivilegeId_;
	params['where_clause'] += ' and security_profile_id = ' + securityProfileId_;
	params['passThru'] = 'pendingDiv~securityGrant';
	params['passThru'] += securityPrivilegeId_ + 'Id;';
	var successf = function(rslt) {
		if (!rslt['serverSideFail']) {
			briefNotify('Privilege Revoked');
			sortDivChildren('#availableGrantsId');
		}else {
			briefNotify('There was a problem granting this privilege');
			assignGrantStatus(rslt['PT_pendingDiv'], 'GRANT');
		}

	};
	serverCall(params, successf, FAILF);
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function makeAvailableAllPrivileges() {

	$('#grantedPrivilegesId').children().remove();
	$('#availableGrantsId').children().remove();
	populateAvailableGrantsWithAll();
	sortDivChildren('#availableGrantsId');


}
/**
 *
 * SRC: [%SRC_LOC%]
 * =====================================================================
 * @param {string} divName_  to sort.
 */
function sortDivChildren(divName_) {
	var children = $(divName_).children().sort(function(a, b) {
		var vA = $(a).attr('id');
		var vB = $(b).attr('id');
		return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
	});
	$(divName_).children().remove();
	$(divName_).append(children);
	if (isUserAuthorized('INSERT_SECURITY_PROFILE_GRANT')) {
		makeDragable(divName_ + ' .securityGrant');
	}
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	var divIdToSecure;
	divIdToSecure = '#grantAssignDiv';
	(isUserAuthorized('SELECT_SECURITY_PROFILE_GRANT')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]FormSave';
	(isUserAuthorized('[%UPDATE_GRANT%]')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]FormAdd';
	(isUserAuthorized('[%INSERT_GRANT%]')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]EntryDivId';
	(isUserAuthorized('[%UPDATE_GRANT%]') ||
	 isUserAuthorized('[%INSERT_GRANT%]')) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	if (!isUserAuthorized('[%INSERT_GRANT%]') &&
			!isUserAuthorized('[%UPDATE_GRANT%]')) {
				securityLockForm('[%divId%]Form', true);
			}
	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			isFormEmpty('[%divId%]Form')) {
				securityLockForm('[%divId%]Form', true);
			}
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function clear[%ucfirst(divId)%]Form() {
	clearForm('[%divId%]Form');
	makeAvailableAllPrivileges();
	$('#grantAssignDiv').addClass('LogicDisabled');
	if (isUserAuthorized('[%INSERT_GRANT%]', false)) {
		securityshow('#[%divId%]FormAdd');
		securityLockForm('[%divId%]Form', false);
	}else {
		securityHide('#[%divId%]FormAdd');
		securityLockForm('[%divId%]Form', true);
	}
}



