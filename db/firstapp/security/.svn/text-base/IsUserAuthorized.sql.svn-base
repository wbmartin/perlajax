\o ./log/IsUserAuthorized.log
--
-- CREATE FUNCTION: isUserAuthorized
--
CREATE OR REPLACE FUNCTION isUserAuthorized(in clientId_ integer , in userId_ text , in tran_ text )
RETURNS boolean
AS
$BODY$
Declare
  rowCount integer;
 Begin
   select count(*) into rowCount 
   from vw_user_grant 
   where client_id =clientId_ and user_id =userId_ and priv_name = tran_;
   
   if rowCount <> 1 then
	raise exception 'ACCESS DENIED-- user is not authorized for this transaction';
   end if;
   return true;
 End;
$BODY$
LANGUAGE 'plpgsql' VOLATILE;


CREATE OR REPLACE FUNCTION initsession( userid_ text, password_ text)
  RETURNS security_user AS
$BODY$
 Declare
	sessionId_  character varying;
	result security_user ;
	clientId  integer;
 Begin
 select client_id into clientId from security_user where user_id = userid_ and  password_enc = md5(password_);
 --client_id, user_id, password_enc, session_id, session_expire_dt, active_yn, last_update, security_profile_id
 select * into result from initsession(clientId, userid_ , password_ );
 return result;
  
 End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION initsession(integer, text, text) OWNER TO postgres;
