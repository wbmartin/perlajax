begin;
CREATE OR REPLACE FUNCTION initsession(checkauthdummyplaceholder text, userid_ text, sessiondummyplaceholder text, password_ text)
  RETURNS security_user AS
$BODY$
 Declare
	sessionId_  character varying;
	securityUser security_user;
 Begin
  sessionId_ := to_hex(((random() * 1000)^3)::Integer ) || to_hex(((random() * 1000)^3)::Integer )
	|| to_hex(((random() * 1000)^3)::Integer )  || to_hex(((random() * 1000)^3)::Integer );
  update security_user 
  set session_id =sessionId_ , session_expire_dt = now()+ '20 min', pwd_reset_cd=''
  where user_id = userID_ 
    and password_enc = md5(password_);
  if found then
  select * into securityUser from security_user where user_id =  userID_;
    
  else 
    securityUser.user_id :='';
    securityUser.session_id='';
  end if;
  return securityUser ;
 End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION initsession_onetime(checkauthdummyplaceholder text, userid_ text, sessiondummyplaceholder text, resetcode_ text)
  RETURNS security_user AS
$BODY$
 Declare
	sessionId_  character varying;
	securityUser security_user;
 Begin
  
  update security_user 
  set session_id =resetcode_, session_expire_dt = now()+ '20 min', pwd_reset_cd=''
  where user_id = userID_ 
    and pwd_reset_cd =resetcode_ ;
  if found then
  select * into securityUser from security_user where user_id =  userID_;
    
  else 
    securityUser.user_id :='';
    securityUser.session_id='';
  end if;
  return securityUser ;
 End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;



commit;
