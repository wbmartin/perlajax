var cacheCtl;

function CacheCtl($http){
  cacheCtl = this;

  var self = this;
  this.typeLabelValueCache = new Array();
  this.retrieveCache = function(){ 
  var startTime, stopTime;
  var rowCount, rowNdx,r, newHTML, newRow;
  var params = {};
  var typeNdx;
  params['spwfResource'] = "cross_table_cache";
  params['spwfAction'] = "select";
  prepParams(params);

  startTime= new Date();

 $http.post(urlTarget,params).success(function(data, status, headers, config) {
	stopTime=new Date();
	if(!validateServerResponse(data)) return false;
	statusMsg("Sucessfully Retrieved Cache Values in " + (stopTime.getTime()-startTime.getTime())/1000 + "s" );
        cacheCtl.typeLabelValueCache = data.rows;
        onRefreshCache();

  });


}//end retrieveCache


}//end CacheCTL

function onRefreshCache(){
golfScoreCtl.golfers = cacheCtl.typeLabelValueCache;
 // populateSelect($('#golfer_idselect'), typeLabelValueCache["golfer"]);
}
