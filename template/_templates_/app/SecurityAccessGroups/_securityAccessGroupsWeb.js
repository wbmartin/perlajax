[% divId = 'securityAccessGroups' %]
[% SRC_LOC = '_securityGrantsWeb'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/


var is[%ucfirst(divId)%]AlreadyInited = false;
/**
 *
 * SRC: [%SRC_LOC%]
 *=====================================================================
 */
function init[%ucfirst(divId)%]() {
	if (!is[%ucfirst(divId)%]AlreadyInited) {
		$('#availableGrantsId').droppable({
			accept: '.securityGrant',
			drop: handleSecurityRevokeDrop
		});
		$('#grantedPrivilegesId').droppable({
			accept: '.securityGrant',
			drop: handleSecurityGrantDrop
		});


		is[%ucfirst(divId)%]AlreadyInited = true;
	}

}
