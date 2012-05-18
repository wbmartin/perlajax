\o ./log/InitSession.log
-- Function: initsession(integer, text, text)

-- DROP FUNCTION initsession(integer, text, text);

CREATE OR REPLACE FUNCTION initsession(clientid_ integer, userid_ text, password_ text)
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
  where client_id = clientId_ 
    and user_id = userID_ 
    and password_enc = md5(password_);
  if found then
  select * into securityUser from security_user where user_id =  userID_;
    return securityUser ;
  else 
    raise exception 'Invalid Username or Password -- Access Denied';
  end if;
 End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION initsession(integer, text, text) OWNER TO postgres;

-- Function: initsession(text, text)

-- DROP FUNCTION initsession(text, text);

CREATE OR REPLACE FUNCTION initsession(userid_ text, password_ text)
  RETURNS security_user AS
$BODY$
 Declare
	sessionId_  character varying;
	result security_user ;
	clientId  integer;
 Begin
 select client_id into clientId from security_user where user_id = userid_ ;
 --client_id, user_id, password_enc, session_id, session_expire_dt, active_yn, last_update, security_profile_id
 select * into result from initsession(clientId, userid_ , password_ );
 return result;
  
 End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION initsession(text, text) OWNER TO postgres;

