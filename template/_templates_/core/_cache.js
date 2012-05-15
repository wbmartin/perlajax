//var cacheCtl;
//function CacheCtl($http){
//  cacheCtl = this;
//  cacheCtl.typeLabelValueCache = new Array();
//  cacheCtl.retrieveCache = function(){ 
//    var startTime,typeNdx, params;
//    params = prepParams(params,"cross_table_cache","select");
//    startTime= new Date();
//    $http.post(urlTarget,params).success(
//      function(data, status, headers, config) {
//	if(handleServerResponse("Sucessfully Retrieved Cache ",startTime, data)){
//          onRefreshCache(data.rows);
//	}
//      }
//    );
//  }//end retrieveCache
//}//end CacheCTL
var GOLFER_CACHE;
function retrieveCache(){
 var params =prepParams(params,"cross_table_cache","select" );
  var successf = function (rslt){
	onRefreshCache(rslt.rows);
  };
  var failf = function(){alert("failed");}
  serverCall(params,successf,failf);
}

function onRefreshCache(data){
	GOLFER_CACHE={};
	for(var i=0;i< data.length; i++){
	   if(data[i].tp === "golfer"){
		GOLFER_CACHE[data[i].val] = data[i].lbl; 
	  }
	}
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


