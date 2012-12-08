[% SRC_LOC = '_layoutComponentsMobile'%]
/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} msg message.
 */
function showDialog(msg) {
	alert(msg);
}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} title_ title.
 * @param {string} msg_ message.
 */
function showDialog(title_, msg_) {
	$('#userMsgDialog #title').html(title_);
	$('#userMsgDialog #msg').html(msg_);
	$.mobile.changePage('#userMsgDialog', {'transition': 'pop'});


}

/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 * @param {string} msg  message.
 * @param {string} type type.
 */
function briefNotify(msg, type) {
	var color;
	if (type == null || type == 'INFO') {
		color = 'ui-body-b';
	}else if (type == 'WARNING') {
		color = 'ui-body-b';
	}else if (type == 'ERROR') {
		color = 'ui-body-e';
	}else {
		color = 'ui-body-a';
	}

	var msgDiv = '<div class="ui-loader ui-overlay-shadow ';
	msgDiv += color + ' ui-corner-all"><h3>';
	msgDiv += msg + '</h3></div>';
	$(msgDiv)
		.css({ display: 'block', 
			opacity: 0.90, 
			position: 'fixed',
			padding: '7px',
			'text-align': 'center',
			width: '270px',
			left: ($(window).width() - 284) / 2,
			top: $(window).height() / 2 })
		.appendTo($.mobile.pageContainer).delay(1500)
		.fadeOut(400, function() {
			$(this).remove();
		});
}


