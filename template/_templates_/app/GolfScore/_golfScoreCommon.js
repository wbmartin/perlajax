[% divId = 'golfScore' %]
[% spwfResource = 'golf_score' %]
[% prkey = 'golf_score_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper%]
[% INSERT_GRANT = 'INSERT_'_ spwfResource  FILTER upper%]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper%]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper%]


//Server Calls
[% SRC_LOC = '_golfScoreCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} golferId_ prkey.
* @param {integer} selectedKey_ selected prkey.
* @return {boolean} allowed.
*/
function retrieve[%ucfirst(divId)%]List(golferId_, selectedKey_) {
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	var params = prepParams(params, '[%spwfResource%]' , 'select');
	params['where_clause'] = 'golfer_id =' + golferId_;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			populate[%ucfirst(divId)%]ListTable(rslt.rows);
		} else {
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
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	params = prepParams(params, '[%spwfResource%]', 'SELECT');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
			bindToForm('[%divId%]Form', rslt.rows[0]);
			toggleSaveMode('[%divId%]Form', true);
		} else {
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
*=====================================================================a
* @param {integer} [%toCC(prkey)%]_ prkey.
* @param {string} lastUpdate_  last update for trans mgmt.
* @return {boolean} allowed.
*/
function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized('[%DELETE_GRANT%]')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	var params = prepParams(params, '[%spwfResource%]' , 'delete');
	params['[%prkey%]'] = [%toCC(prkey)%]_;
	params['last_update'] = lastUpdate_;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			remove[%ucfirst(divId)%]ListTableRow(rslt.[%prkey%]);
			briefNotify('Golf Score Deleted Successfully', 'INFO');
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
* @param {Object} params  ajax data.
* @return {boolean} allowed.
*/
function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]') &&
			!isUserAuthorized('[%INSERT_GRANT%]')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	params = prepParams(params, '[%spwfResource%]', insertUpdateChoose);
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			if (rslt.spwfAction == 'UPDATE') {
				replace[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			} else if (rslt.spwfAction == 'INSERT') {
				addNew[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}
			briefNotify('Golf Score Successfully Saved', 'INFO');
			var tempGolferId = $('#[%divId%]Form-golfer_id').val();
			clear[%ucfirst(divId)%]Form();
			$('#[%divId%]Form-golfer_id').val(tempGolferId);

		} else {
			briefNotify(
					'There was a problem communicating with the Server.',
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
* @param {integer} [%divId%]Id_ prkey.
* @return {boolean} allowed.
*/
function edit[%ucfirst(divId)%]([%divId%]Id_) {
	if (!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}
	if (isUserAuthorized('[%UPDATE_GRANT%]')) {
		securityLockForm('[%divId%]Form', false);
	} else {securityLockForm('[%divId%]Form', true);}



	if ([%divId%]Id_) {
		var params = {'where_clause' : '[%prkey%]=' + [%divId%]Id_};
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
	if (!isUserAuthorized('[%UPDATE_GRANT%]') &&
			!isUserAuthorized('[%INSERT_GRANT%]')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
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
	return formValid;
}

//Top Level HTML Manip
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} dataRows array of [%ucfirst(divId)%].
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
*=====================================================================
* @param {Object} data [%ucfirst(divId)%] info.
* @return {Object} list table row. 
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash = {};
	var links = '';
	dataHash['golf_score'] = formatNumber(data.golf_score, 0, true, false, true);
	dataHash['game_dt'] = pgDate(data.game_dt);
	if (isUserAuthorized('[%UPDATE_GRANT%]')) {
		links += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
	  links += data.[%prkey%] + ')">Edit</a> ';
		links += '&nbsp; &nbsp;';
	} else if (isUserAuthorized('[%SELECT_GRANT%]')) {
	  links += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
	  linke += data.[%prkey%] + ')">View</a> ';
		links += '&nbsp; &nbsp;';

	}
	if (isUserAuthorized('[%DELETE_GRANT%]')) {
		links += '<a class="alink" onclick="delete[%ucfirst(divId)%](';
	  links += data.[%prkey%] + ', "' + data.last_update + '")>Delete</a> ';
		links += '&nbsp; &nbsp;';
	}

		dataHash['links'] = links;
	dataHash['DT_RowId'] = '[%ucfirst(divId)%]ListTableTR-' + data.[%prkey%];
	return dataHash;
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================a
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
* =====================================================================
* @param {integer} [%toCC(prkey)%]_  prkey.
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
* @param {integer} golferId_ prkey.
* @return {boolean} allowed.
*/
function show[%ucfirst(divId)%](golferId_) {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'show[%ucfirst(divId)%]')) {
		return false;
				}
	retrieve[%ucfirst(divId)%]List(golferId_);
	retrieveGolferNameForGolfScore(golferId_);
  standardShowContentPane('[%divId%]', 'Golf Score View');
	if (isFormEmpty('[%divId%]Form')) toggleSaveMode('[%divId%]Form', false);
	if ($('#[%divId%]Form-golfer_id').val() != golferId_) {
		clear[%ucfirst(divId)%]Form();
	}
	$('#[%divId%]Form-golfer_id').val(golferId_);
	$('#[%divId%]GolferNameId').html(GOLFER_CACHE[golferId_] + ' Golf Scores ');
	impose[%ucfirst(divId)%]SecurityUIRestrictions();
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function clear[%ucfirst(divId)%]Form() {
	var golferId = $('#[%divId%]Form-golfer_id').val();
	clearForm('[%divId%]Form');
	$('#[%divId%]Form-golfer_id').val(golferId);
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityLockForm('[%divId%]Form', false) :
		securityLockForm('[%divId%]Form', true);
}


//page specific functions
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} golferId_ prkey.
* @return {boolean} allowed.
*/
function retrieveGolferNameForGolfScore(golferId_) {
	if (!isUserAuthorized('SELECT_GOLFER')) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}

	var params = prepParams(params, 'GOLFER', 'SELECT');
	params['where_clause'] = 'golfer_id =' + golferId_;
	var successf = function(rslt) {
		$('#[%divId%]GolferNameId').html(rslt.rows[0].name);
	};
	serverCall(params, successf, FAILF);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	var divIdToSecure;
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

