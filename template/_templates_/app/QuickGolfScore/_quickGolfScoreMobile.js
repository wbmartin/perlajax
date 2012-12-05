[% divId = 'quickGolfScore' %]
[% spwfResource = 'golf_score' %]
[% prkey = 'golf_score_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]
//validation
[% SRC_LOC = '_quickGolfScoreMobile'%]
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
* @param {Object} dataRows  array of hash objects.
*/
function populate[%ucfirst(divId)%]ListTable(dataRows) {
		var newRow = '<div class = "ui-block-a ui-th">Golfer</div>';
	newRow += '<div class = "ui-block-b ui-th">Score (Date)</div>';
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
* @param {Object} data  rowdata.
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
	var newRow = '<div class = "ui-block-a ui-td">';
  newRow +=  GOLFER_CACHE[data['golfer_id']] + '</div>';
	newRow += '<div class = "ui-block-b ui-td">';
	newRow += '<a href="#" onclick="show[%ucfirst(divId)%]Entry(';
	newRow +=  data['golf_score_id'] + ')">';
  newRow +=  formatNumber(data['golf_score'], 0, true, false, true);
  newRow += ' (' + formatDate(data['game_dt'],'MM-DD');
  newRow += ')';
	newRow += '</a>';
	newRow += '</div>';
	return newRow;

	
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} row row to replace.
*/
function replace[%ucfirst(divId)%]ListTableRow(row) {
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} row row to add.
*/
function addNew[%ucfirst(divId)%]ListTableRow(row) {
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} [%toCC(prkey)%]_ prkey.
*/
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
}

//Div Access and App Layout Calls
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {integer} id pkey to show
*/
function show[%ucfirst(divId)%]Entry(id) {
	var params = {};
	if(id) {
		params['where_clause'] = 'golf_score_id = ' + id;
		retrieve[%ucfirst(divId)%](params)
	} else {
		clear[%ucfirst(divId)%]Form();
	}
  $.mobile.changePage('#[%divId%]EntryDivId');
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]History() {
	retrieve[%ucfirst(divId)%]List();
	$.mobile.changePage('#[%divId%]HistoryDivId');
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	
}



