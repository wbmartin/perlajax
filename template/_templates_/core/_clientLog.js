[%divId="clientLogViewer"%]

function show[%ucfirst(divId)%](){
	hideCurrentContentPane();
	statusMsg("Navigated to Log Viewer");
  var newHTML="";
  $("#[%divId%]").fadeIn();
  $("ul#clientLogView").find("li").remove();[%#remove all list items.%]
   logMsg("Log Viewed");
  for(var ndx=0;ndx<clientLog.length;ndx++){
	newHTML +="<li>"+ clientLog[ndx].logDt+"|" + clientLog[ndx].msg + "</li>";
  }
  $("ul#clientLogView").html(newHTML);
  currentContentPane="[%divId%]";
}
