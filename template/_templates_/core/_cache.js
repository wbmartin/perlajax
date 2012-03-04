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
          onRefreshCache(data.rows);
	}
      }
    );
  }//end retrieveCache


}//end CacheCTL

function onRefreshCache(data){
	cacheCtl.typeLabelValueCache =new Array();
	golfScoreCtl.golfers = new Array();	
	for(var i=0;i< data.length; i++){
	   cacheCtl.typeLabelValueCache.push(data[i]);
	   if(data[i].tp === "golfer"){
		golfScoreCtl.golfers.push({lbl:data[i].lbl, val:data[i].val}); 
	  }
	}
}


function getLbl4Val(val, type){
  var cacheToSearch;
	if (type ==="golfer"){ cacheToSearch = deepCopy(golfScoreCtl.golfers);
	}else if( type==""){
	}else{
		return "INVALID CACHE REQUESTED";
	}
//alert(cacheToSearch.length);
	alert (val + " " + cacheToSearch.length);
	for (var i=0; i < cacheToSearch.length;i++){
		if(cacheToSearch.val === val){
			return cacheToSearch.lbl;
		}
	}
	return "--";

}

function deepCopy(obj){
return $.extend(true, [], obj);
}
