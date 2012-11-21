[% divId = 'golfer' %]
[% spwfResource = 'golfer' %]
[% prkey = 'golfer_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ divId FILTER upper%]
[% INSERT_GRANT = 'INSERT_' _ divId  FILTER upper%]
[% SELECT_GRANT = 'SELECT_' _ divId  FILTER upper%]
[% DELETE_GRANT = 'DELETE_' _ divId  FILTER upper%]

//----------------------------------------------------

//server calls

function retrieve[%ucfirst(divId)%]List() {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'retrieve[%ucfirst(divId)%]List')) {
				 	return false;
				}

	var params = prepParams(params, '[%spwfResource%]' , 'select');
	params['orderby_clause'] = ' ';
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
function retrieve[%ucfirst(divId)%](params) {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'retrieve[%ucfirst(divId)%]')) {
					return false;
				}

	params = prepParams(params, '[%spwfResource%]', 'SELECT');
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
			bindToForm('[%divId%]Form', rslt.rows[0]);
			toggleSaveMode('[%divId%]Form', true);
		}else {
			briefNotify('There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}



function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) &&
			!isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify('Access Violation', 'ERROR');
		return false;
	}
	params = prepParams(params, 'golfer', insertUpdateChoose);
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			bindToForm('[%divId%]Form', rslt.rows[0]);
			if (rslt.spwfAction == 'UPDATE') {
				replaceRow[%ucfirst(divId)%]ListTable(rslt.rows[0]);
			}else if (rslt.spwfAction == 'INSERT') {
				addNewRow[%ucfirst(divId)%]ListTable(rslt.rows[0]);
			}
			briefNotify('Golfer Saved Successfully', 'INFO');
			clear[%ucfirst(divId)%]Form();
		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}



function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized('[%DELETE_GRANT%]', true, 'delete[%ucfirst(divId)%]'))
		return false;

	var params = prepParams(params, '[%spwfResource%]' , 'delete');
	params['[%prkey%]'] = [%toCC(prkey)%]_;
	params['last_update'] = lastUpdate_;
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			remove[%ucfirst(divId)%]ListTableRow(rslt.[%prkey%]);
			briefNotify('Golfer Deleted Successfully', 'INFO');
		}else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}


//-----------------------
//Server Call Wrappers
function edit[%ucfirst(divId)%](rowId_) {
	if (!isUserAuthorized('[%SELECT_GRANT%]',
												true,
												'edit[%ucfirst(divId)%]'))
		return false;

	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		securityLockForm('[%divId%]Form', false);
	}else {securityLockForm('[%divId%]Form', true);}

	if (rowId_) {
		var params = {'where_clause': 'golfer_id=' + rowId_};
		retrieve[%ucfirst(divId)%](params);
	}
}

function save[%ucfirst(divId)%]Form() {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) &&
			!isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify('Access Violation save[%ucfirst(divId)%]Form', 'ERROR');
		return false;
	}

	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
		save[%ucfirst(divId)%](params);
	}else {
		briefNotify('Please Correct Form Validation Errors To Continue',
								'WARNING'
								);
	}
}

//validation
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	return formValid;
}

//----------------------------------------------------
//html building functions

function populate[%ucfirst(divId)%]ListTable(dataRows, selectedKey_) {
	var dataArray = new Array();
	for (var i = 0; i < dataRows.length; i++) {
		dataArray[i] = build[%ucfirst(divId)%]ListTableRow(dataRows[i]);
		if (dataRows[i].[%prkey%] == selectedKey_) {
			bindToForm('[%divId%]Form', dataRows[i]);
			toggleSaveMode('[%divId%]Form', true);
		}
	}
	$('#[%divId%]ListTable').dataTable().fnClearTable();
	$('#[%divId%]ListTable').dataTable().fnAddData(dataArray, true);
}

function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash = {};
	var htmlRow = '';
	dataHash['name'] = data.name;
	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		htmlRow += '<a class="edit[%ucfirst(divId)%]Link" ';
		htmlRow += ' onclick="edit[%ucfirst(divId)%](';
		htmlRow += data.[%prkey%] + ')">Edit</a>';
		htmlRow += ' &nbsp; &nbsp; ';
	}else if (isUserAuthorized('[%SELECT_GRANT%]', false)) {
		htmlRow += '<a class="alink" onclick="edit[%ucfirst(divId)%](';
		htmlRow += data.[%prkey%] + ')">View</a> ';
		htmlRow += ' &nbsp; &nbsp;';
	}

	if (isUserAuthorized('[%DELETE_GRANT%]', false)) {
		htmlRow += '<a class="delete[%ucfirst(divId)%]Link" ';
	 	htmlRow += ' onclick="delete[%ucfirst(divId)%](';
		htmlRow += data.[%prkey%] + ', \'' + data.last_update;
	 	htmlRow += '\')">Delete</a>';
	}
	dataHash['links'] = htmlRow;
	dataHash['DT_RowId'] = '[%ucfirst(divId)%]ListTableTR-' + data.[%prkey%];
	return dataHash;
}

function replaceRow[%ucfirst(divId)%]ListTable(row) {
	$('#[%divId%]ListTable').dataTable().fnUpdate(
			build[%ucfirst(divId)%]ListTableRow(row),
			$('#[%ucfirst(divId)%]ListTableTR-' + row.[%prkey%])[0]
			);
}
function addNewRow[%ucfirst(divId)%]ListTable(row) {
	var newNdx = $('#[%divId%]ListTable').dataTable().fnAddData(
			build[%ucfirst(divId)%]ListTableRow(row)
			);
}
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
	$('#[%divId%]ListTable').dataTable().fnDeleteRow(
			$('#[%ucfirst(divId)%]ListTableTR-' + [%toCC(prkey)%]_)[0]
		 	);
}

function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	var divIdToSecure;
	divIdToSecure = '#[%divId%]FormSave';
	(isUserAuthorized('[%UPDATE_GRANT%]', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]FormAdd';
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure = '#[%divId%]EntryDivId';
	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			!isUserAuthorized('[%UPDATE_GRANT%]', false)) {
			securityLockForm('[%divId%]Form', true);
	}
	if (!isUserAuthorized('[%INSERT_GRANT%]', false) &&
			isFormEmpty('[%divId%]Form')) {
			securityLockForm('[%divId%]Form', true);
	}


}


//-------------------------------------------------
//Div Access and App Layout Calls
function show[%ucfirst(divId)%](golferId_) {
	statusMsg('Navigated to Golfer View');
	var params = {};
	hideCurrentContentPane();
	$('#[%divId%]').fadeIn();
	currentContentPane = '[%divId%]';
	if (golferId_) {
		params['where_clause'] = '[%prkey%]=' + [%divId%]Id_;
		retrieve[%ucfirst(divId)%](params);
	} else {
		if (isFormEmpty('[%divId%]Form')) {
			toggleSaveMode('[%divId%]Form', false);
		}
		clearForm('[%divId%]Form');
	}
		retrieve[%ucfirst(divId)%]List();
	impose[%ucfirst(divId)%]SecurityUIRestrictions();

}

function clear[%ucfirst(divId)%]Form() {
	clearForm('[%divId%]Form');
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityLockForm('[%divId%]Form', false) :
		securityLockForm('[%divId%]Form', true);
}


$(document).ready(function() {
		$('#[%divId%]ListTable').dataTable({
			'aoColumns' : [
			 { 'mData': 'name' },
			 { 'mData': 'links', asSorting: 'none' }
			],
			'sPaginationType' : 'two_button'
			}
			);
		});

