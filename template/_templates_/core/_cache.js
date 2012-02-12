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

  startTime= new Date();

 $http.post(urlTarget,params).success(function(data, status, headers, config) {
	stopTime=new Date();
	if(!validateServerResponse(data)){
		alert("[%serverErrorMsg_Communication%]");
		return false;
	}
	statusMsg("Sucessfully Retrieved Cache Values in " + (stopTime.getTime()-startTime.getTime())/1000 + "s" );
        cacheCtl.typeLabelValueCache = data.rows;
        onRefreshCache();

  });







//    $.post(urlTarget,params, function(rJSON){ 
//	stopTime=new Date();
//	if(!validateServerResponse(rJSON)){
//		alert("[%serverErrorMsg_Communication%]");
//		return false;
//	}
//	for (rowNdx=0;rowNdx <rJSON.rowCount; rowNdx++){
//	  [%#strip out other messages update/add to clientCache%]
//	  if (!(rJSON.rows[rowNdx].tp in typeLabelValueCache )){
//		//typeLabelValueCache[rJSON.rows[rowNdx].tp]={}; [%# conditionally initialize the row%]
//		typeLabelValueCache[rJSON.rows[rowNdx].tp]=new Array();
//		typeNdx=0;
//	  }
//	  //typeLabelValueCache[rJSON.rows[rowNdx].tp][typeNdx++] = {lbl: rJSON.rows[rowNdx].lbl , val:rJSON.rows[rowNdx].val};
//	  typeLabelValueCache[rJSON.rows[rowNdx].tp].push( {lbl: rJSON.rows[rowNdx].lbl , val:rJSON.rows[rowNdx].val});
//	}
//        });  
}//end retrieveCache
spwfService.register('cacheRetrieve',this.retrieveCache);

}//end CacheCTL

function onRefreshCache(){
golfScoreCtl.golfers = cacheCtl.typeLabelValueCache;
 // populateSelect($('#golfer_idselect'), typeLabelValueCache["golfer"]);
}
