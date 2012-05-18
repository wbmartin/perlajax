\o ./log/IsSessionValid.log
--
-- CREATE FUNCTION: isSessionValid
--
CREATE OR REPLACE FUNCTION isSessionValid(in clientId_ integer , in userId_ text , in sessionId_ text )
RETURNS text
AS
$BODY$
Declare
    
Begin

  update security_user 
  set session_expire_dt = now() + '20 min'
  where client_id = clientId_ 
    and user_id = userID_ 
    and session_id = sessionId_;
  if found then
    return 'Valid Session' ;
  else 
    raise exception 'Invalid Session -- Access Denied';
  end if;

End;
$BODY$
LANGUAGE 'plpgsql' VOLATILE;
