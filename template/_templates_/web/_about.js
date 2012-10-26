[% divId="aboutPane" %]

function show[%ucfirst(divId)%]() {
	hideCurrentContentPane();
	statusMsg("Navigated to About");
	$("#[%divId%]").fadeIn();
	currentContentPane = "[%divId%]";
	return "[%divId%]";
}


