[% divId='aboutPane' %]

[% SRC_LOC = '_cacheCommon'%]
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
	return '[%divId%]';
}


