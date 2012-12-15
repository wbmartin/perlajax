[%divId='clientLogViewer'%]

[% SRC_LOC = 'clientLogWeb'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
function show[%ucfirst(divId)%]() {
	hideCurrentContentPane();
	setCurrentContentPane('Log Viewer', '[%divId%]');
  var newHTML = '';
  $('#[%divId%]').fadeIn();
  $('ul#clientLogView').find('li').remove();[%#remove all list items.%]
  for (var ndx = 0; ndx < clientLog.length; ndx++) {
	newHTML += '<li>' + clientLog[ndx].logDt + '|';
 	newHTML += clientLog[ndx].msg + '</li>';
  }
  $('ul#clientLogView').html(newHTML);
}
