[% divId ='helpPane' %]

	function show[%ucfirst(divId)%]() {
		statusMsg("Navigated to Help Portal");
		hideCurrentContentPane();
		$("#[%divId%]").fadeIn();
		currentContentPane = "[%divId%]";
		return "[%divId%]";
	}


