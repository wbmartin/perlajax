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

$(document).ready(function() {
	var tblClasses = $.fn.dataTableExt.oStdClasses;
	tblClasses.sPagePrevDisabled = '[%buttonClass%] smallButton LogicDisabled';
	tblClasses.sPagePrevEnabled = '[%buttonClass%] smallButton';
	tblClasses.sPageNextDisabled = '[%buttonClass%] smallButton LogicDisabled';
	tblClasses.sPageNextEnabled = '[%buttonClass%] smallButton';
	tblClasses.sWrapper = 'prettyWrapper dataTables_wrapper';

});



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

