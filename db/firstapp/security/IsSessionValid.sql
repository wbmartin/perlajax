\o ./log/IsSessionValid.log
--
-- CREATE FUNCTION: isSessionValid
--
CREATE OR REPLACE FUNCTION isSessionValid( in userId_ text , in sessionId_ text )
RETURNS text
AS
$BODY$
Declare
    
Begin

  update security_user 
  set session_expire_dt = now() + '20 min'
  where user_id = userID_ 
    and session_id = sessionId_ and session_id is not null and session_id !='';
  if found then
    return 'Valid Session' ;
  else 
    return 'Session Invalid -- Access Denied';
  end if;

End;
$BODY$
LANGUAGE 'plpgsql' VOLATILE;
