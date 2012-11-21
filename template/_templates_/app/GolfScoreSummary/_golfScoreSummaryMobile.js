[% divId = 'golfScoreSummary' %]
[% spwfResource = 'golf_score_summary' %]

[% UPDATE_GRANT = 'UPDATE_' _ spwfResource FILTER upper %]
[% INSERT_GRANT = 'INSERT_' _ spwfResource  FILTER upper %]
[% SELECT_GRANT = 'SELECT_GOLFER_HANDICAP'  FILTER upper %]
[% DELETE_GRANT = 'DELETE_' _ spwfResource  FILTER upper %]
//After complete Load setup
$(document).ready(function() {
		
});


function populate[%ucfirst(divId)%]ListTable(dataRows) {

}

function build[%ucfirst(divId)%]ListTableRow(gs){

}

