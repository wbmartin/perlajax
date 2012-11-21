function showDialog(msg_, height_, width_, modal_, buttons_, title_) {
	$('#genericDialogDivId').dialog('destroy');
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

