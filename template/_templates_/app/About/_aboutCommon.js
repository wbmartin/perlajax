[% divId='aboutPane' %]

[% SRC_LOC = '_aboutCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {string}  div rendered.
*/
function show[%ucfirst(divId)%]() {
	hideCurrentContentPane();
	statusMsg('Navigated to About');
	$('#[%divId%]').fadeIn();
	currentContentPane = '[%divId%]';
	//_gaq.push(['_trackEvent', 'showDiv', '[%divId%]']);
	_gaq.push(['_trackPageview','[%divId%]']);
	return '[%divId%]';
}


