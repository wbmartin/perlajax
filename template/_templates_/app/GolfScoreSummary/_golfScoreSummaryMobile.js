[% divId = 'golfScoreSummary' %]
[% spwfResource = 'golf_score_summary' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_GOLFER_HANDICAP'  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


[% SRC_LOC = '_golfScoreSummaryMobile'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} dataRows  array of [%ucfirst(divId)%] objects.
*/
function populate[%ucfirst(divId)%]ListTable(dataRows) {
//	var dataArray = new Array();
	var newRow = '<div class = "ui-block-a"><b>Golfer</b></div>';
	newRow += '<div class = "ui-block-b"><b>Handicap</b></div>';
	var newTable = newRow;

	for (var ndx = 0; ndx < dataRows.length; ndx++) {
		newTable += build[%ucfirst(divId)%]ListTableRow(dataRows[ndx]);
	}
	$('#[%divId%]TableId').html(newTable);



}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} data rowdata.
* @return {string}  built div.
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
	var newRow = '<div class = "ui-block-a">' + data.golfer_name + '</div>';
	newRow += '<div class = "ui-block-b">';
  newRow += formatNumber(data.golf_score, 2, true, false, true);
  newRow += '</div>';
	return newRow;
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]() {
	retrieve[%ucfirst(divId)%]List();
	$.mobile.changePage('#[%divId%]DivId');
}
