function showDialog(msg){
alert(msg);
}

	function showDialog(title_, msg_){
		$("#userMsgDialog #title").html(title_);
		$("#userMsgDialog #msg").html(msg_);
		$.mobile.changePage("#userMsgDialog", {"transition":"pop"});


	}

function briefNotify(msg,type) {
	// you are right here working on brief notify http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.js
  if (typeof(delay)==='undefined') {
    var delay = 3500; // in milliseconds
  }
  if (typeof(theme)==='undefined') {
    var theme = 'a'; // default theme; setting this to 'e' is nice for error messages
  }
  var css_class = '';
  if (theme==='e') {
    css_class = 'ui-body-e';
  }
  $.mobile.loadingMessage = msg;
  $.mobile.showPageLoadingMsg();
  $(".ui-loader").addClass(css_class).find(".spin:visible").hide(); // hide the spinner graphic
  setTimeout(
    function() {
      $(".ui-loader").removeClass(css_class).find(".spin:hidden").show(); // show the spinner graphic when we are done
      $.mobile.hidePageLoadingMsg();
      $.mobile.loadingMessage = DEFAULT_LOADING_MSG; // reset back to default message
    }, 
    delay
  );
}

