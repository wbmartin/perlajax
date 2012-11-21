[% divId = 'LoginPortal' %]
[% spwfResource = 'security_user' %]

function onSuccessfulLogin(){
  $.mobile.changePage("#summaryDivId");
}

function validate[%ucfirst(divId)%]Form(){
return true;
}


