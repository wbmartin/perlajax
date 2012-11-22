[% divId = 'golfScoreSummary' %]
[% spwfResource = 'golf_score_summary' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_GOLFER_HANDICAP'  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


function retrieve[%ucfirst(divId)%]List() {
		if (!isUserAuthorized('[%SELECT_GRANT%]')) {
			briefNotify('Access Violation', 'ERROR');
			return false;
		}

		var params = prepParams(params, '[%spwfResource%]' , 'select');
		var successf = function(rslt) {
			if (!rslt[SERVER_SIDE_FAIL]) {
				populate[%ucfirst(divId)%]ListTable(rslt.rows);
			}else {
				briefNotify(
						'There was a problem communicating with the Server.',
						'ERROR');
			}

		};
		var failf = function() {alert('failed');};
		serverCall(params, successf, failf);

	}



function impose[%ucfirst(divId)%]SecurityUIRestrictions() {

}




