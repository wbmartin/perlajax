var cacheCtl;
function CacheCtl($http){
  cacheCtl = this;
  cacheCtl.typeLabelValueCache = new Array();
  cacheCtl.retrieveCache = function(){ 
    var startTime,typeNdx, params;
    params = prepParams(params,"cross_table_cache","select");
    startTime= new Date();
    $http.post(urlTarget,params).success(
      function(data, status, headers, config) {
	if(handleServerResponse("Sucessfully Retrieved Cache ",startTime, data)){
          cacheCtl.typeLabelValueCache = data.rows;
          onRefreshCache();
	}
      }
    );
  }//end retrieveCache


}//end CacheCTL

function onRefreshCache(){
  golfScoreCtl.golfers = cacheCtl.typeLabelValueCache;
}
