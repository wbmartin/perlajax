begin;
CREATE OR REPLACE FUNCTION issessionvalid(userid_ text, sessionid_ text)
  RETURNS text AS
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
    raise exception 'Session Invalid -- Access Denied';
    --return 'Session Invalid -- Access Denied';
  end if;

End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--wrapper for issessionValid
CREATE OR REPLACE FUNCTION keepalive(alreadyAuth_ text, userid_ text, sessionid_ text)
  RETURNS text AS
$BODY$
Declare
Begin
 return issessionvalid(userid_, sessionid_ );
End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


commit;
