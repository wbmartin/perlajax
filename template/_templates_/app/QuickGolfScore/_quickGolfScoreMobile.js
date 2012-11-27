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
	return true;
}

//Top Level HTML Manip
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} dataRows  array of hash objects.
*/
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {Object} data  rowdata.
*/
function build[%ucfirst(divId)%]ListTableRow(data) {
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



