[% SRC_LOC = '_layoutComponentsWeb'%]
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
function displayMainLayout(showHide) {
	var display = (showHide) ? 'block' : 'none';
	//document.getElementById('leftnav').style.display=display;
	document.getElementById('header').style.display = display;
	document.getElementById('footer').style.display = display;
	document.getElementById('mainContent').style.display = display;
	display = (showHide) ? 'none' : 'block';
	document.getElementById('LoginPortal').style.display = display;
	if (!showHide)showLoginPortal();
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

});



/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function briefNotify(msg, type) {
	var color;
	if (type == null || type == 'INFO') {
		color = 'green';
	}else if (type == 'WARNING') {
		color = 'yellow';
	}else if (type == 'ERROR') {
		color = 'red';
	}else {
		color = 'black';
	}
	$('#briefNoticeMsg').css('border-color', color);
	$('#briefNoticeMsg').css('color', color);
	$('#briefNoticeMsg').html(msg);
	$('#briefNotice').fadeIn(300).delay(1500).fadeOut(400);
	statusMsg(msg);
}


/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function showDialog(msg_, height_, width_, modal_, buttons_, title_) {
	if ($('#genericDialogDivId').is(':data(dialog)')) {
		$('#genericDialogDivId').dialog('destroy');
	}
	msg_ = msg_ || 'No message Defined';
	height_ = height_ || 300;
	width_ = width_ || 400;
	modal_ = (modal_ === undefined) ? true : modal_;
	buttons_ = buttons_ || {'Ok': function() {$(this).dialog('close');}};
	title_ = title_ || '';
	$('#genericDialogDivId').attr('title', title_);
	$('#dialogMsgSpanId').html(msg_);
	$('#genericDialogDivId').dialog(
			{
				resizable: false,
		height: height_,
		width: width_,
		modal: modal_,
		buttons: buttons_
			});
	if (title_ === '') {
		$('#genericDialogDivId').siblings('.ui-dialog-titlebar').hide();
	}else {
		$('#genericDialogDivId').siblings('.ui-dialog-titlebar').show();

	}

}

