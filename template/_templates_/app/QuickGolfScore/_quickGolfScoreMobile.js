[% divId = 'quickGolfScore' %]
[% spwfResource = 'golf_score' %]
[% prkey = 'golf_score_id' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]
//validation
function validate[%ucfirst(divId)%]Form() {
	var formName = '[%divId%]Form';
	var formValid = standardValidate(formName);
	return true;
}

//Top Level HTML Manip
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	
}

function build[%ucfirst(divId)%]ListTableRow(data) {
}

function replace[%ucfirst(divId)%]ListTableRow(row) {
}
function addNew[%ucfirst(divId)%]ListTableRow(row) {
}
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
}

//Div Access and App Layout Calls
function show[%ucfirst(divId)%]Entry() {
  $.mobile.changePage("#[%divId%]EntryDivId");
}
function show[%ucfirst(divId)%]History() {
  $.mobile.changePage("#[%divId%]historyDivId");
}


function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	
}



