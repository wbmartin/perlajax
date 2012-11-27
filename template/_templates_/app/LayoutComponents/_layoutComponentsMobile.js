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
	// you are right here working on brief notify http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.js
  if (typeof(delay) === 'undefined') {
    var delay = 3500; // in milliseconds
  }
  if (typeof(theme) === 'undefined') {
		// default theme; setting this to 'e' is nice for error messages
    var theme = 'a'; 
  }
  var css_class = '';
  if (theme === 'e') {
    css_class = 'ui-body-e';
  }
  $.mobile.loadingMessage = msg;
  $.mobile.showPageLoadingMsg();
	// hide the spinner graphic
  $('.ui-loader').addClass(css_class).find('.spin:visible').hide(); 
  setTimeout(
    function() {
			// show the spinner graphic when we are done
      $('.ui-loader').removeClass(css_class).find('.spin:hidden').show();     
			$.mobile.hidePageLoadingMsg();
			// reset back to default message
      $.mobile.loadingMessage = DEFAULT_LOADING_MSG; 
    }, 
    delay
  );
}

