[% SRC_LOC = '_cacheMobile'%]
/**
*
* SRC: [%SRC_LOC%]
*/
function populateAppSelectOptions() {
	setSelectOptions('#quickGolfScoreForm select[name=golfer_id]',
										GOLFER_CACHE
									);
}

/**
*
* SRC: [%SRC_LOC%]
*/
function imposeApplicationSecurityRestrictions() {

}
