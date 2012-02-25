\o ./log/IsUserAuthorized.log
--
-- CREATE FUNCTION: isUserAuthorized
--
CREATE OR REPLACE FUNCTION isUserAuthorized( in userId_ text , in tran_ text )
RETURNS boolean
AS
$BODY$
Declare
  rowCount integer;
 Begin
   select count(*) into rowCount 
   from vw_user_grant 
   where  user_id =userId_ and priv_name = tran_;
   
   if rowCount <> 1 then
	raise exception 'ACCESS DENIED-- user is not authorized for this transaction';
    return false;
   end if;
   return true;
 End;
$BODY$
LANGUAGE 'plpgsql' VOLATILE;


