function sizeLeftNav() {
	[%headerHeight = 100%]
		[%leftNavWidth = 0%]
		// document.getElementById('leftnav').style.height= (window.innerHeight-60) + "px";
		document.getElementById('mainContent').style.top="[%headerHeight%]px";
	document.getElementById('mainContent').style.left="0px";
	document.getElementById('mainContent').style.height=(window.innerHeight - [%headerHeight + 35%] ) + "px";
	document.getElementById('mainContent').style.width=(window.innerWidth- [%leftNavWidth + 20%] ) + "px";
}
function displayMainLayout(showHide) {
	var display = (showHide) ? "block" : "none";
	//document.getElementById('leftnav').style.display=display;
	document.getElementById('header').style.display=display;
	document.getElementById('footer').style.display=display;
	document.getElementById('mainContent').style.display=display;
	display = (showHide) ? "none" : "block";
	document.getElementById('LoginPortal').style.display=display;
	if (!showHide)showLoginPortal();
}

$(document).ready( function() {

		$.fn.dataTableExt.oStdClasses.sPagePrevDisabled ="[%buttonClass%] smallButton LogicDisabled";
		$.fn.dataTableExt.oStdClasses.sPagePrevEnabled ="[%buttonClass%] smallButton";
		$.fn.dataTableExt.oStdClasses.sPageNextDisabled ="[%buttonClass%] smallButton LogicDisabled";
		$.fn.dataTableExt.oStdClasses.sPageNextEnabled ="[%buttonClass%] smallButton";

		$.fn.dataTableExt.oStdClasses.sWrapper="prettyWrapper dataTables_wrapper";

		});

function showDialog(msg_, height_, width_, modal_, buttons_, title_) {
	$("#genericDialogDivId").dialog( "destroy" );

	msg_ =msg_ || "No message Defined";
	height_ = height_|| 300;
	width_=width_ || 400;
	modal_ = (modal_ === undefined) ? true : modal_;
	buttons_=buttons_|| {"Ok" : function() {$( this ).dialog( "close" );}};
	title_ = title_ || '';
	$("#genericDialogDivId").attr("title", title_);
	$("#dialogMsgSpanId").html(msg_);
	$("#genericDialogDivId").dialog(
			 {
resizable : false, 
height : height_, 
width : width_, 
modal : modal_, 
buttons : buttons_
});
if (title_ ==='') {
	$("#genericDialogDivId").siblings(".ui-dialog-titlebar").hide();
}else {
	$("#genericDialogDivId").siblings(".ui-dialog-titlebar").show();

}

}


function briefNotify(msg, type) {
	var color;
	if (type== null || type=='INFO') {
		color="green";
	}else if (type=='WARNING') {
		color="yellow";
	}else if (type=='ERROR') {
		color="red";
	}else {
		color="black";
	}
	$("#briefNoticeMsg").css("border-color", color);
	$("#briefNoticeMsg").css("color", color);
	$("#briefNoticeMsg").html(msg);
	$('#briefNotice').fadeIn(300).delay(1500).fadeOut(400);
	statusMsg(msg);
}

