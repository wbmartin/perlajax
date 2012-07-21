var GOLFER_CACHE;
function onRefreshCache(data){
	GOLFER_CACHE={};
	for(var i=0;i< data.length; i++){
	   if(data[i].tp === "golfer"){
		GOLFER_CACHE[data[i].val] = data[i].lbl; 
	  }
	}

setSelectOptions("#quickGolfScoreForm select[name=golfer_id]", GOLFER_CACHE);
}



function retrieveCache(){
 var params =prepParams(params,"cross_table_cache","select" );
  var successf = function (rslt){
	onRefreshCache(rslt.rows);
  };
  serverCall(params,successf,FAILF);
}

function getLbl4Val(val, type){
  var lbl;
	if (type ==="golfer"){ lbl=GOLFER_CACHE.val; 
	}else if( type==""){
	}else{
		return "INVALID CACHE REQUESTED";
	}
	if (isEmpty(lbl) ){
	  lbl ="--";
	}
	return lbl;

}



