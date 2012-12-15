[% divId='aboutPane' %]

[% SRC_LOC = '_aboutCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
* @return {string}  div rendered.
*/
function show[%ucfirst(divId)%]() {
	standardShowContentPane('[%divId%]','About');
	return '[%divId%]';
}
