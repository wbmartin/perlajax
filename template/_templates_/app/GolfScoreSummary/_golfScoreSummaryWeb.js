[% divId = 'golfScoreSummary' %]
[% spwfResource = 'golf_score_summary' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_GOLFER_HANDICAP'  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]

[% SRC_LOC = '_golfScoreSummaryWeb'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
$(document).ready(function() {
		$('#[%divId%]ListTable').dataTable(
			 {
			'aoColumns' : [
			 {'mData': 'golfer_name' },
			 {'mData': 'handicap' },
			 {'mData': 'date_range' },
			 {'mData': 'links', asSorting: 'none' }
			],
			'sPaginationType': 'two_button'
			});
		});

/**
*
* SRC: [%SRC_LOC%]
* =====================================================================
* @param {Object} dataRows Array of [%ucfirst(divId)%].
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
* @param {Object} gs golfscore info.
* @return {Object} tablerow data.
*/
function build[%ucfirst(divId)%]ListTableRow(gs) {
	var dataHash = {};
	var links = '';
	dataHash['golfer_name'] = gs.golfer_name;
	dataHash['handicap'] = formatNumber(gs.golf_score, 2, true, false, true);
	dataHash['date_range'] = pgDate(gs.first_date) + ' - ' + pgDate(gs.last_date);

	if (isUserAuthorized('SELECT_GOLF_SCORE')) {
		links += '<a class="alink" onclick="changePage(function() {showGolfScore(';
	 	links += gs.golfer_id + ')})">View Scores</a>  ';
		links += '&nbsp; &nbsp;';
	}
	if (isUserAuthorized('SELECT_GOLFER')) {
		links += ' <a href="" onclick="changePage(function() {showGolfer(';
	 	links += gs.golfer_id + ')})">View Golfer</a>';
	}
	dataHash['links'] = links;
	//dataHash["DT_RowId"] = "[%ucfirst(divId)%]ListTableTR-" + data.[%prkey%];

	return dataHash;

}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]() {
	statusMsg('Navigated to Golf Score Summary View');
	retrieve[%ucfirst(divId)%]List();
	standardShowContentPane('[%divId%]');
}

