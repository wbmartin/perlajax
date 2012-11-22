[% divId = 'quickGolfScore' %]
[% spwfResource = 'golf_score' %]
[% prkey = 'golf_score_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


//Server Calls
function retrieve[%ucfirst(divId)%]List() {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'retrieve[%ucfirst(divId)%]List')) {
				 	return false;
				}

	var params = prepParams(params, '[%spwfResource%]' , 'select');
	params['orderby_clause'] = ' order by game_dt desc';
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
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}



function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized(
				'[%DELETE_GRANT%]',
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
			briefNotify('Golf Score Deleted Successfully', 'INFO');
		} else {
			briefNotify(
					'There was a problem communicating with the Server.',
					'ERROR'
					);
		}

	};
	serverCall(params, successf, FAILF);
}

function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) &&
			!isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify(
				'Access Violation : save[%ucfirst(divId)%] ',
				'ERROR'
				);
		return false;
	}

	params = prepParams(params, '[%spwfResource%]', insertUpdateChoose);
	var successf = function(rslt) {
		clearForm('[%divId%]Form');
		if (!rslt[SERVER_SIDE_FAIL]) {
			if (rslt.spwfAction == 'UPDATE') {
				replace[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}else if (rslt.spwfAction == 'INSERT') {
				addNew[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}
			briefNotify('Golf Score Successfully Saved', 'INFO');
			clear[%ucfirst(divId)%]Form();

		}
		else {
			briefNotify('Golf Score Saved Failed', 'ERROR');

		}
	};
	serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function edit[%ucfirst(divId)%]([%divId%]Id_) {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'edit[%ucfirst(divId)%]')) {
				 	return false;
				}
	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		securityLockForm('[%divId%]Form', false);
	}else {securityLockForm('[%divId%]Form', true);}


	if ([%divId%]Id_) {
		var params = {'where_clause' : '[%prkey%]=' + [%divId%]Id_};
		retrieve[%ucfirst(divId)%](params);
	}
}

function save[%ucfirst(divId)%]Form() {
	if (!isUserAuthorized('[%UPDATE_GRANT%]') &&
			!isUserAuthorized('[%SELECT_GRANT%]')) {
		briefNotify('Access Violation : save', 'ERROR');
		return false;
	}

	if (validate[%ucfirst(divId)%]Form()) {
		var params = bindForm('[%divId%]Form');
		save[%ucfirst(divId)%](params);
	}
}



function clear[%ucfirst(divId)%]Form() {
	clearForm('[%divId%]Form');
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?
		securityLockForm('[%divId%]Form', false) :
		securityLockForm('[%divId%]Form', true);
}


//After complete Load setup
$(document).ready(function() {
		$('#[%divId%]Form-game_dt').datepicker();

		});

//page specific functions
function retrieveGolferNameForGolfScore(golferId_) {
	if (!isUserAuthorized(
				'[%SELECT_GRANT%]',
				true,
				'retrieveGolferNameForGolfScore')) {
					return false;
				}

	var params = prepParams(params, 'GOLFER', 'SELECT');
	params['where_clause'] = 'golfer_id =' + golferId_;
	var successf = function(rslt) {
		$('#[%divId%]GolferNameId').html(rslt.rows[0].name);
	};
	serverCall(params, successf, FAILF);
}


