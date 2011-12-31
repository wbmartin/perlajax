var typeLabelValueCache = {};
function retrieveCache(){ 
"use strict";
  var startTime, stopTime;
  var rowCount, rowNdx,r, newHTML, newRow;
  var params = {};
  params['spwfResource'] = "cross_table_cache";
  params['spwfAction'] = "select";
  params['user_id'] = usrLoginId;
  params['password'] = usrSessionId;
  registerAction();

  startTime= new Date();
    $.post(urlTarget,params, function(rJSON){ 
		stopTime=new Date();
		if(!validateServerResponse(rJSON)){
			alert("[%serverErrorMsg_Communication%]");
			return false;
		}
		for (rowNdx=0;rowNdx <rJSON.rowCount; rowNdx++){
		  [%#strip out other messages update/add to clientCache%]
alert(rJSON.rows[rowNdx].tp + " " + rJSON.rows[rowNdx].lbl + " "+ rJSON.rows[rowNdx].val);
		if (!(rJSON.rows[rowNdx].lbl in typeLabelValueCache )){
			typeLabelValueCache[rJSON.rows[rowNdx].tp]={}; [%# conditionally initialize the row%]
		}
		typeLabelValueCache[rJSON.rows[rowNdx].tp][rJSON.rows[rowNdx].lbl] = rJSON.rows[rowNdx].val;
		}

		
$("#statusMsg").html("Sucessfully Retrieved Cache Values in " + (stopTime.getTime()-startTime.getTime())/1000 + "s" );

        });  
}

