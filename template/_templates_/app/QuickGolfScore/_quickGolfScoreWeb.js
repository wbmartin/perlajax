[% divId = 'quickGolfScore' %]
[% spwfResource = 'golf_score' %]
[% prkey = 'golf_score_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]

//After complete Load setup
[% SRC_LOC = '_quickGolfScoreWeb'%]
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
* @param {Object} dataRows  row of [%ucfirst(divId)%] objects.
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
*=====================================================================a
* @param {Object} data info.
* @return {Object} list table row.
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash = {};
	var links = '';
	dataHash['golfer_name'] = GOLFER_CACHE[data.golfer_id];
	dataHash['golf_score'] = formatNumber(data.golf_score, 0, true, false, true);
	dataHash['game_dt'] = pgDate(data.game_dt);
	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		links += '	<a class="alink" onclick="edit[%ucfirst(divId)%](';
	  links += data.[%prkey%] + ')">Edit</a> ';
		links += ' &nbsp; &nbsp ';
	}else if (isUserAuthorized('[%SELECT_GRANT%]', false)) {
		links += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
	  links += data.[%prkey%] + ')">View</a> ';
		links += ' &nbsp; &nbsp;';

	}

	if (isUserAuthorized('[%DELETE_GRANT%]', false)) {
		links += '<a class="alink" onclick="delete[%ucfirst(divId)%](';
		links += data.[%prkey%] + ', \'' + data.last_update;
	  links += '\')">Delete</a>  ';
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
*/
function show[%ucfirst(divId)%]() {
	retrieve[%ucfirst(divId)%]List();
	standardShowContentPane('[%divId%]', 'Quick Golf Score Entry');
	if (isFormEmpty('[%divId%]Form')) {
	 	toggleSaveMode('[%divId%]Form', false);
	}
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
	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			isFormEmpty('[%divId%]Form')) {
		securityLockForm('[%divId%]Form', true);
	}

}

