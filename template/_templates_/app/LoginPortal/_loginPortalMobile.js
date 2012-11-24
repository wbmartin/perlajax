[% divId = 'LoginPortal' %]

function onSuccessfulLogin(){
	retrieveCache();
	showLaunchPane();
}

function validate[%ucfirst(divId)%]Form(){
  return true;
}


