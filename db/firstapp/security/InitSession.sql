\o ./log/InitSession.log
-- Function: initsession( text, text, text, text)

-- DROP FUNCTION initsession(  text, text, text, text);

CREATE OR REPLACE FUNCTION initsession( checkAuthDummyPlaceHolder text, userid_ text, sessionDummyPlaceHolder text,password_ text)
  RETURNS security_user AS
$BODY$
 Declare
	sessionId_  character varying;
	securityUser security_user;
 Begin
  sessionId_ := to_hex(((random() * 1000)^3)::Integer ) || to_hex(((random() * 1000)^3)::Integer )
	|| to_hex(((random() * 1000)^3)::Integer )  || to_hex(((random() * 1000)^3)::Integer );
  update security_user 
  set session_id =sessionId_ , session_expire_dt = now()+ '20 min'
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
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION initsession( text, text, text, text) OWNER TO postgres;


