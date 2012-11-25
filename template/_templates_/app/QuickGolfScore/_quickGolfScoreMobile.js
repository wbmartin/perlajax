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
*/
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	return true;
}

//Top Level HTML Manip
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function replace[%ucfirst(divId)%]ListTableRow(row) {
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function addNew[%ucfirst(divId)%]ListTableRow(row) {
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
}

//Div Access and App Layout Calls
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]Entry() {
  $.mobile.changePage('#[%divId%]EntryDivId');
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]History() {
  $.mobile.changePage('#[%divId%]historyDivId');
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	
}



