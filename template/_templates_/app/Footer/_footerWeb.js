[% SRC_LOC = '_footerWeb'%]

'use strict';
	var urlTarget = 'cgi-bin/server.pl';
	var passwordResetUrlTarget = 'cgi-bin/pwdreset.pl';
	var VIEW_ID = 0;
	var PAGE_CALLS = new Array();
	var IS_MOBILE = false;

	[% SRC_LOC = '_footerWeb'%]
	/**
	 *
	 * SRC: [%SRC_LOC%]
	 *=====================================================================
	 */
	function bodyOnLoad() {
		sizeLeftNav();
	}
/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function bodyOnResize() {
	sizeLeftNav();
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function changePage(strFuncCall_) {
	PAGE_CALLS.push(strFuncCall_);
	top.location.hash = '#' + VIEW_ID++;
}

/**
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param prettyName name of the page to log.
 * @param divId name of the divId to set as active content page.
 */ 
function setCurrentContentPane(prettyName, divId) {
  statusMsg('Navigated to ' + prettyName);
	currentContentPane = divId;
	_gaq.push(['_trackPageview',divId]);
}

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @param {string} name divid.
*/
function standardShowContentPane(name, prettyName) {
	hideCurrentContentPane();
	$('#' + name).fadeIn();
	setCurrentContentPane(prettyName, name);
}
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {string}  empty string.
*/
function hideMainContent() {
	return '';
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
$(window).bind('hashchange', function() {
		var id = window.location.hash.replace('#', '');
		if (id >= 0 && id < PAGE_CALLS.length) PAGE_CALLS[id]();
		});

/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function sizeLeftNav() {
[%headerHeight = 100%]
[%leftNavWidth = 0%]
		document.getElementById('mainContent').style.top =
		'[%headerHeight%]px';
	document.getElementById('mainContent').style.left = '0px';
	document.getElementById('mainContent').style.height =
		(window.innerHeight - [%headerHeight + 35%]) + 'px';
	document.getElementById('mainContent').style.width =
		(window.innerWidth - [%leftNavWidth + 20%]) + 'px';
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
$(document).ready(function() {
	var tblClasses = $.fn.dataTableExt.oStdClasses;
	tblClasses.sPagePrevDisabled = '[%buttonClass%] smallButton LogicDisabled';
	tblClasses.sPagePrevEnabled = '[%buttonClass%] smallButton';
	tblClasses.sPageNextDisabled = '[%buttonClass%] smallButton LogicDisabled';
	tblClasses.sPageNextEnabled = '[%buttonClass%] smallButton';
	tblClasses.sWrapper = 'prettyWrapper dataTables_wrapper';

	changePage(function() {showLoginPortal()});


	[%divId = 'golfer'%]	
	//[%divId%]	
	$('#[%divId%]ListTable').dataTable({
		'aoColumns' : [
	{ 'mData': 'name' },
		{ 'mData': 'links', asSorting: 'none' }
	],
		'sPaginationType' : 'two_button'
	}
	);
[%divId = 'golfScore'%]	
	//[%divId%]
	$('#[%divId%]Form-game_dt').datepicker();

$('#[%divId%]ListTable').dataTable({
	'aoColumns': [
{'mData': 'golf_score'},
{'mData': 'game_dt'},
{'mData': 'links', asSorting: 'none'}
],
'sPaginationType': 'two_button'
}
);

[% divId = 'golfScoreSummary' %]
//[%divId%]
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

[% divId = 'quickGolfScore' %]
$('#[%divId%]ListTable').dataTable({
	'aoColumns' : [
{ 'mData': 'golfer_name' },
{ 'mData': 'golf_score' },
{ 'mData': 'game_dt' },
{ 'mData': 'links', asSorting: 'none' }
],
'sPaginationType' : 'two_button'
}
);
[% divId = 'quickGolfScore' %]
$('#[%divId%]Form-game_dt').datepicker({dateFormat: 'yy-mm-dd'});


[% divId = 'securityAccessGroups' %]
//[%divId%]
$('#[%divId%]ListTable').dataTable(
		{'aoColumns' : [
			{ 'mData': 'profile_name' },
	{ 'mData': 'links', asSorting: 'none' }
],
	'sPaginationType' : 'two_button'
		}
		);


[% divId = 'securityUser' %]
//[%divId%]
$('#[%divId%]ListTable').dataTable({
	'aoColumns': [
{'mData': 'user_id' },
{'mData': 'links', asSorting: 'none' }
],
'sPaginationType': 'two_button'
}
);
[% divId = 'supportRequest' %]
//[%divId%]

$('#[%divId%]ListTable').dataTable({
	'aoColumns': [
{ 'mData': 'details', bSortable: false, 'sWidth': '10'},
{ 'mData': 'support_request_id', 'sWidth': '10' },
{ 'mData': 'summary', 'sClass': 'textAlignLeft'},
{ 'mData': 'detailed_description', bVisible: false },
// { 'mData': 'log_details' },
// { 'mData': 'solution_description' },
{ 'mData': 'last_update', bVisible: false},
// { 'mData': 'updated_by' },
{ 'mData': 'links', asSorting: 'none', 'sWidth': '10em' }
],
'sPaginationType': 'two_button'
}
);


$('#[%divId%]ListTable tbody td span.expanderClass').live(
		'click',
		function() {
			var nTr = $(this).parents('tr')[0];
			var oTable = $('#[%divId%]ListTable').dataTable();
			if (oTable.fnIsOpen(nTr)) { /* This row is already open - close it */
				$(this).replaceWith(
					'<span class="sprite16Icon smallPlusIcon expanderClass"></span>'
					);
				oTable.fnClose(nTr);
			} else { /* Open this row */
				$(this).replaceWith(
					'<span class="sprite16Icon smallCancelIcon expanderClass"></span>'
					);
				oTable.fnOpen(nTr,
					fnFormat[%ucfirst(divId)%]Expansion(oTable, nTr),
					'details'
					);
			}
		}
		);



});

