[% SRC_LOC = '_cacheCommon'%]
/**
*
* SRC: [%SRC_LOC%]
*=====================================================================
*/
var GOLFER_CACHE;
var SECURITY_PROFILE_CACHE;
var SECURITY_GRANT;

/**
* 
* @param {Object} data. 
* SRC: [%SRC_LOC%]
*=====================================================================
*/

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
  populateAppSelectOptions();
  imposeApplicationSecurityRestrictions();	
	}


/**
* 
* SRC: [%SRC_LOC%]
*/

function retrieveCache() {
	var params = prepParams(params, 'cross_table_cache', 'select');
	var successf = function(rslt) {
		onRefreshCache(rslt.rows);
	};
	serverCall(params, successf, FAILF);
}


