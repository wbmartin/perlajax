function populateAppSelectOptions() {
	setSelectOptions('#quickGolfScoreForm select[name=golfer_id]',
										GOLFER_CACHE
									);
	setSelectOptions('#securityUserForm select[name=securityProfileId]',
		 								SECURITY_PROFILE_CACHE
									);
}

function imposeApplicationSecurityRestrictions() {
  imposeGolferSecurityUIRestrictions();
	imposeGolfScoreSecurityUIRestrictions();
	imposeLauncherSecurityUIRestrictions();
	imposeGolfScoreSummarySecurityUIRestrictions();
	imposeSecurityUserSecurityUIRestrictions();
	imposeSecurityGrantsSecurityUIRestrictions();
	imposeQuickGolfScoreSecurityUIRestrictions();

}

