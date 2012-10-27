[% divId = 'supportRequest' %]
[% spwfResource = 'support_request' %]
[% prkey = 'support_request_id' %]
[% prettyName = 'Support Request' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_' _ spwfResource  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]


//Server Calls
function retrieve[%ucfirst(divId)%]List() {
	if (!isUserAuthorized('[%SELECT_GRANT%]', true, 'retrieve[%ucfirst(divId)%]List') ) return false; 

	var params =prepParams(params, '[%spwfResource%]' , 'select' );
	//params['orderby_clause'] =" order by game_dt desc"
	var successf = function (rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			populate[%ucfirst(divId)%]ListTable(rslt.rows)
		}else {
			briefNotify('There was a problem communicating with the Server.', 'ERROR');
		}
	};
	serverCall(params, successf, FAILF);
}
function retrieve[%ucfirst(divId)%](params) {
	if (!isUserAuthorized("[%SELECT_GRANT%]", true, "retrieve[%ucfirst(divId)%]" ) ) return false; 

	params = prepParams(params, "[%spwfResource%]", "SELECT");
	var successf = function(rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			rslt.rows[0].game_dt = pgDate(rslt.rows[0].game_dt);
			bindToForm('[%divId%]Form', rslt.rows[0]);
			toggleSaveMode('[%divId%]Form', true);
		}else {
			briefNotify("There was a problem communicating with the Server.", "ERROR")
		}

	}
	serverCall(params, successf, FAILF);
}



function delete[%ucfirst(divId)%]([%toCC(prkey)%]_, lastUpdate_) {
	if (!isUserAuthorized("[%DELETE_GRANT%]", true, "delete[%ucfirst(divId)%]" )) return false;
	var params =prepParams(params, "[%spwfResource%]" , "delete" );
	params['[%prkey%]'] = [%toCC(prkey)%]_;
	params['last_update'] = lastUpdate_;
	var successf = function (rslt) {
		if (!rslt[SERVER_SIDE_FAIL]) {
			remove[%ucfirst(divId)%]ListTableRow(rslt.[%prkey%]);
			briefNotify("[%prettyName%] Deleted Successfully", "INFO");
		}else {
			briefNotify("There was a problem communicating with the Server.", "ERROR")
		}

	};
	serverCall(params, successf, FAILF);
}

function save[%ucfirst(divId)%](params) {
	if (!isUserAuthorized('[%UPDATE_GRANT%]', false) && !isUserAuthorized('[%INSERT_GRANT%]', false)) {
		briefNotify("Access Violation : save[%ucfirst(divId)%] ", "ERROR");
		return false;
	}

	params = prepParams(params, "[%spwfResource%]", insertUpdateChoose);
	var successf=function(rslt) {
		clearForm('[%divId%]Form');
		if (!rslt[SERVER_SIDE_FAIL]) {
			if (rslt.spwfAction == "UPDATE") {
				replace[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}else if (rslt.spwfAction == "INSERT") {
				addNew[%ucfirst(divId)%]ListTableRow(rslt.rows[0]);
			}
			briefNotify("[%prettyName%] Successfully Saved", "INFO");
			clear[%ucfirst(divId)%]Form();

		}
		else {
			briefNotify("[%prettyName%] Score Saved Failed", "ERROR");

		}
	};
	serverCall(params, successf, FAILF);
}

//ServerCall Wrappers
function edit[%ucfirst(divId)%]([%divId%]Id_) {
	show[%ucfirst(divId)%]Dialog();	
	if ( !isUserAuthorized("[%SELECT_GRANT%]", true, "edit[%ucfirst(divId)%]")) return false; 
	if (isUserAuthorized('[%UPDATE_GRANT%]', false) ) {
		securityLockForm('[%divId%]Form', false);
	}else {securityLockForm('[%divId%]Form', true);}




	if ([%divId%]Id_) {
		var params = {"where_clause" : "[%prkey%]=" +[%divId%]Id_};
		retrieve[%ucfirst(divId)%](params);
	}
}

function save[%ucfirst(divId)%]Form() {
	if (!isUserAuthorized('[%UPDATE_GRANT%]') && !isUserAuthorized("[%SELECT_GRANT%]")) {
		briefNotify("Access Violation : save [%prettyName%]", "ERROR");
		return false;
	}

	if (validate[%ucfirst(divId)%]Form()) {
		$("#[%divId%]FormHolder").dialog("close");
		var params = bindForm('[%divId%]Form');
		save[%ucfirst(divId)%](params);
	}
}

//validation
function validate[%ucfirst(divId)%]Form() {
	var formName='[%divId%]Form';
	var formValid  = standardValidate(formName);
	return formValid;
}

//Top Level HTML Manip
var [%ucfirst(divId)%]prKey = {};
function populate[%ucfirst(divId)%]ListTable(dataRows) {
	var dataArray= new Array();
	for(var ndx = 0;ndx< dataRows.length;ndx++) {
		dataArray[ndx] = build[%ucfirst(divId)%]ListTableRow(dataRows[ndx]);
		[%ucfirst(divId)%]prKey[dataRows[ndx].[%prkey%]] = ndx;
	}
	$('#[%divId%]ListTable').dataTable().fnClearTable();
	$('#[%divId%]ListTable').dataTable().fnAddData( dataArray, true );
}

function build[%ucfirst(divId)%]ListTableRow(data) {
	var dataHash= {};
	var links ="";
	dataHash["details"] = "<span class='sprite16Icon smallPlusIcon expanderClass'></span>" ;

	dataHash["support_request_id"] = data.support_request_id ;
	dataHash["summary"] =  data.summary;
	dataHash["detailed_description"] = data.detailed_description;
	dataHash["log_details"] = data.log_details;
	dataHash["solution_description"] = data.solution_description;
	dataHash["last_update"] = pgDate(data.last_update);
	dataHash["updated_by"] = data.updated_by;

	if (isUserAuthorized('[%UPDATE_GRANT%]', false)) {
		links += "	<a class='alink' onclick='edit[%ucfirst(divId)%](" +data.[%prkey%] + ")'>Edit</a> ";
		links += " &nbsp; &nbsp ";
	}else if (isUserAuthorized("[%SELECT_GRANT%]", false)) {
		links += "<a class='alink' onclick='edit[%ucfirst(divId)%](" +data.[%prkey%] + ")'>View</a> ";
		links += " &nbsp; &nbsp;";

	}

	if (isUserAuthorized("[%DELETE_GRANT%]", false)) {
		links += "<a class='alink' onclick=\"delete[%ucfirst(divId)%](" +data.[%prkey%] + ", '"+data.last_update +"')\">Delete</a>  ";
	}
	dataHash["links"] =links; 
	dataHash["DT_RowId"] = "[%ucfirst(divId)%]ListTableTR-" + data.[%prkey%];

	return dataHash;
}

function replace[%ucfirst(divId)%]ListTableRow(row) {
	$("#[%divId%]ListTable").dataTable().fnUpdate(build[%ucfirst(divId)%]ListTableRow(row), [%ucfirst(divId)%]prKey[row.[%prkey%]] );
}
function addNew[%ucfirst(divId)%]ListTableRow(row) {
	$("#[%divId%]ListTable").dataTable().fnAddData(build[%ucfirst(divId)%]ListTableRow(row));
}
function remove[%ucfirst(divId)%]ListTableRow([%toCC(prkey)%]_) {
	$("#[%divId%]ListTable").dataTable().fnDeleteRow([%ucfirst(divId)%]prKey[[%toCC(prkey)%]_] );
}

//Div Access and App Layout Calls
function show[%ucfirst(divId)%]() {
	statusMsg("Navigated to Support Request");
	retrieve[%ucfirst(divId)%]List(); 
	hideCurrentContentPane();
	$("#[%divId%]").fadeIn();
	currentContentPane="[%divId%]";
	if ( isFormEmpty('[%divId%]Form')) toggleSaveMode('[%divId%]Form', false);

}

function clear[%ucfirst(divId)%]Form() {
	$("#[%divId%]FormHolder").dialog("close");
	clearForm('[%divId%]Form');
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ? securityLockForm('[%divId%]Form', false) : securityLockForm('[%divId%]Form', true);
}


//After complete Load setup
$(document).ready(function() {
	$("#[%divId%]ListTable").dataTable( {
		"aoColumns" : [
	 { "mData" : "details" , bSortable : false, "sWidth" : "10"}, 
	 { "mData" : "support_request_id", "sWidth" : "10" }, 
	 { "mData" : "summary"  , "sClass" : "textAlignLeft"}, 
	 { "mData" : "detailed_description", bVisible : false }, 
	// { "mData" : "log_details" }, 
	// { "mData" : "solution_description" }, 
	 { "mData" : "last_update",  bVisible : false}, 
	// { "mData" : "updated_by" }, 
	 { "mData" : "links", asSorting : "none", "sWidth" : "10em" }
	], 
	"sPaginationType" : "two_button"
	}
	);


	$('#[%divId%]ListTable tbody td span.expanderClass').live('click', function () {
		var nTr = $(this).parents('tr')[0];
		var oTable = $("#[%divId%]ListTable").dataTable();
		if ( oTable.fnIsOpen(nTr) ) { /* This row is already open - close it */
			$(this).replaceWith( "<span class='sprite16Icon smallPlusIcon expanderClass'></span>") ;
			oTable.fnClose( nTr );
		}
		else { /* Open this row */
			$(this).replaceWith( "<span class='sprite16Icon smallCancelIcon expanderClass'></span>") ;
			oTable.fnOpen( nTr, fnFormat[%ucfirst(divId)%]Expansion(oTable, nTr), 'details' );
		}
	} );


});




function fnFormat[%ucfirst(divId)%]Expansion ( oTable, nTr )
 {
	var aData = oTable.fnGetData( nTr );
	var sOut = '<div style="padding-left : 50px;">';
	var divStyle= ""
		sOut += ''
		sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Detailed Description : </span><span>' + aData.detailed_description+'</span></div>';
	sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Solution Description : </span><span>' + aData.solution_description+'</span></div>';
	sOut +='<div class="supportRequestAdditionalInfo"><span class="supportRequestAdditionalInfoTitle">Log Details : </span><span>' + aData.log_details+'</span></div>';
	sOut +='';
	sOut += '</div>';
	//var sOut = "<span id='[%ucfirst(divId)%]Expansion'></span>";  
	return sOut;
}
//page specific functions
function impose[%ucfirst(divId)%]SecurityUIRestrictions() {
	var divIdToSecure;
	divIdToSecure ='#[%divId%]FormSave';
	(isUserAuthorized('[%UPDATE_GRANT%]', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure ='#[%divId%]FormAdd';
	(isUserAuthorized('[%INSERT_GRANT%]', false)) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);

	divIdToSecure ='#[%divId%]EntryDivId';
	(isUserAuthorized('[%UPDATE_GRANT%]', false) || isUserAuthorized('[%INSERT_GRANT%]', false) ) ?  securityshow(divIdToSecure) : securityHide(divIdToSecure);
	if (!isUserAuthorized('[%INSERT_GRANT%]', false ) && !isUserAuthorized('[%UPDATE_GRANT%]', false) ) {
		securityLockForm('[%divId%]Form', true);

	}
	if (!isUserAuthorized('[%INSERT_GRANT%]', false) && isFormEmpty('[%divId%]Form') ) {
		securityLockForm('[%divId%]Form', true);
	}

}

function addNew[%ucfirst(divId)%]() {
	var logText = '';
	clear[%ucfirst(divId)%]Form();
	show[%ucfirst(divId)%]Dialog();
	for (var ndx = 0; ndx < clientLog.length; ndx++) {
		logText += clientLog[ndx].logDt + '|' + clientLog[ndx].msg + '\n';
	}

	$('#[%divId%]Form-log_details').val(logText);

}
function show[%ucfirst(divId)%]Dialog() {
	$('#[%divId%]FormHolder').dialog( {modal: true, width: '90%' });
}


