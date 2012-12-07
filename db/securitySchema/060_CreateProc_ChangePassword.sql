
CREATE OR REPLACE FUNCTION change_password(alreadyauth_ text, securityuserid_ text, sessionid_ text, userIdForUpdate_ text, newPassword_ text)
  RETURNS boolean AS
$BODY$
  declare
  begin
    	--perform issessionvalid( securityuserid_,sessionid_) ;
    if securityuserid_ <> userIdForUpdate_ then
    	perform isuserauthorized( securityuserid_, 'CHANGE_OTHERS_PWD' );
    end if;
	update security_user set password_enc = md5(newPassword_), updated_by = securityuserid_	where user_id = userIdForUpdate_ ;

	if found then
	  return true;
	else 
	  raise exception 'Password Update Failed' ;
	end if;
  end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
