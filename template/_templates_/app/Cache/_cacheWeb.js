[% SRC_LOC = '_cacheWeb'%]
/**
*
* SRC: [%SRC_LOC%]
*/
function populateAppSelectOptions() {
	setSelectOptions('#quickGolfScoreForm select[name=golfer_id]',
										GOLFER_CACHE
									);
	setSelectOptions('#securityUserForm select[name=securityProfileId]',
		 								SECURITY_PROFILE_CACHE
									);
}
/**
*
* SRC: [%SRC_LOC%]
*/
function imposeApplicationSecurityRestrictions() {
  imposeGolferSecurityUIRestrictions();
	imposeGolfScoreSecurityUIRestrictions();
	imposeLauncherSecurityUIRestrictions();
	imposeGolfScoreSummarySecurityUIRestrictions();
	imposeSecurityUserSecurityUIRestrictions();
	imposeSecurityAccessGroupsSecurityUIRestrictions();
	imposeQuickGolfScoreSecurityUIRestrictions();

}

