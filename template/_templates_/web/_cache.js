var GOLFER_CACHE;
var SECURITY_PROFILE_CACHE;
var SECURITY_GRANT;
function onRefreshCache(data) {
	GOLFER_CACHE = {};
	SECURITY_PROFILE_CACHE = {};
	SECURITY_GRANT = new Array();
	for (var i = 0; i < data.length; i++) {
		if (data[i].tp === 'golfer') {
			GOLFER_CACHE[data[i].val] = data[i].lbl;
		} else if (data[i].tp === 'securityProfile') {
			SECURITY_PROFILE_CACHE[data[i].val] = data[i].lbl;
		} else if (data[i].tp === 'securityGrant') {
			SECURITY_GRANT.push(data[i].lbl);
		}
	}

	setSelectOptions('#quickGolfScoreForm select[name=golfer_id]', GOLFER_CACHE);
	setSelectOptions('#securityUserForm select[name=securityProfileId]', SECURITY_PROFILE_CACHE);

	imposeGolferSecurityUIRestrictions();
	imposeGolfScoreSecurityUIRestrictions();
	imposeLauncherSecurityUIRestrictions();
	imposeGolfScoreSummarySecurityUIRestrictions();
	imposeSecurityUserSecurityUIRestrictions();
	imposeSecurityGrantsSecurityUIRestrictions();
	imposeQuickGolfScoreSecurityUIRestrictions();
}



function retrieveCache() {
	var params = prepParams (params,'cross_table_cache','select');
	var successf = function (rslt){
		onRefreshCache(rslt.rows);
	};
	serverCall(params,successf,FAILF);
}

//function getLbl4Val(val, type){
//  var lbl;
//  if (type ==="golfer"){ lbl=GOLFER_CACHE.val; 
//  }else if( type==""){
//  }else{
//    return "INVALID CACHE REQUESTED";
//  }
//  if (isEmpty(lbl) ){
//    lbl ="--";
//  }
//  return lbl;
//}


