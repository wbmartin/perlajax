begin;
CREATE OR REPLACE FUNCTION init_passwd_reset(checkauthdummyplaceholder text, userid_ text)
  RETURNS security_user AS
$BODY$
 Declare
  returnVal text;
  sessionId text;	
  securityUser security_user;
 Begin
 returnVal :='';
  sessionId := to_hex(((random() * 1000)^3)::Integer ) || to_hex(((random() * 1000)^3)::Integer )
	|| to_hex(((random() * 1000)^3)::Integer )  || to_hex(((random() * 1000)^3)::Integer );
  update security_user 
  set pwd_reset_cd =sessionId  
  where user_id = userID_ ;
  if found then
    select *into securityUser from security_user where user_id = userID_ ;
  end if;
  return securityUser ;
 End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


CREATE OR REPLACE FUNCTION init_lostuname(checkauthdummyplaceholder text, emailaddr_ text)
  RETURNS security_user AS
$BODY$
 Declare
  returnVal text;
  sessionId text;
  uname text;
  securityUser security_user;
	
 Begin
   select user_id into uname from security_user where email_addr = emailaddr_;
   perform init_passwd_reset('',uname);
   select * into securityUser from security_user where user_id = uname;
   
   return securityUser;
  End;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;	
	
	commit;
