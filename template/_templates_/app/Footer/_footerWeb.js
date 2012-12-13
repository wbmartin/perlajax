[% SRC_LOC = '_footerWeb'%]

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

$('#availableGrantsId').droppable({
	accept: '.securityGrant',
	drop: handleSecurityRevokeDrop
});
$('#grantedPrivilegesId').droppable({
	accept: '.securityGrant',
	drop: handleSecurityGrantDrop
});

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

