
-- Function: vw_user_grant_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION vw_user_grant_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION vw_user_grant_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF vw_user_grant AS
$BODY$
  Declare
   Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_USER_GRANT' );
    end if;
    return query execute 'select * from vw_user_grant ' ||  buildSQLClauses(whereClause_,orderByClause_,rowLimit_,rowOffset_);  
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
--ALTER FUNCTION vw_user_grant_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;
--select * from vw_user_grant_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_user_grant_bypk(text, text, text )
-- DROP FUNCTION vw_user_grant_pybk(text, text, text);
--CREATE OR REPLACE FUNCTION vw_user_grant_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--)
--  RETURNS vw_user_grant AS
--$BODY$
--  Declare
--    result vw_user_grant;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_USER_GRANT' );
--    end if;
--user_id, profile_name, priv_name
--     select * into result from vw_user_grant where ;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION vw_user_grant_bypk(text,  text, text) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_bypk(text,  text, text) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  vw_user_grant_iq(text, text, text ,text,text,text)
-- DROP FUNCTION vw_user_grant_iq( text, text, text,text,text,text);
create or replace function vw_user_grant_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,userId_ text,profileName_ text,privName_ text)
  returns vw_user_grant as
$body$
  declare
    newrow vw_user_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_VW_USER_GRANT' );
    end if;


    insert into vw_user_grant( user_id,profile_name,priv_name)  values ( userId_,profileName_,privName_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function vw_user_grant_iq(text,  text, text ,text,text,text) owner to postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_iq(text,  text, text ,text,text,text) TO GROUP golfscore;

--select * from vw_user_grant_iq('ALREADY_AUTH', 'test', 'test' , 'text', 'text', 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  vw_user_grant_uq(text, text, text ,text,text,text)
-- DROP FUNCTION vw_user_grant_uq(text, text, text ,text,text,text);

create or replace function vw_user_grant_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , userId_ text, profileName_ text, privName_ text)
  returns vw_user_grant as
$body$
  declare
    updatedrow vw_user_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_VW_USER_GRANT' );
    end if;
	update vw_user_grant set user_id= userId_ ,  profile_name= profileName_ ,  priv_name= privName_ 	where    and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for VW_USER_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function vw_user_grant_uq(text,  text, text ,text,text,text) owner to postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_uq(text, text, text ,text,text,text) TO GROUP golfscore;

--select * from vw_user_grant_uq('ALREADY_AUTH', 'test', 'test', 'text', 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  vw_user_grant_dq(text, text , timestamp)
-- DROP FUNCTION vw_user_grant_dq( text,  text , timestamp);

create or replace function vw_user_grant_dq(alreadyauth_ text,  userid_ text, sessionid_ text , lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_VW_USER_GRANT' );
    end if;
	delete from vw_user_grant where   and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for VW_USER_GRANT- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function vw_user_grant_dq(text, text, text, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_dq(text,  text, text, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

-- Function:  vw_user_grant_dqw(text, text, text)
-- DROP FUNCTION vw_user_grant_dqw( text,text,text);
create or replace function vw_user_grant_dqw(alreadyauth_ text,  userid_ text, sessionid_ text , whereClause_ text )
  returns boolean as
$body$
  declare
  rcnt int;  
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_VW_USER_GRANT' );
    end if;
	execute  'delete from vw_user_grant ' ||  buildSQLClauses(whereClause_,'',0,0)  ;
	GET DIAGNOSTICS rcnt = ROW_COUNT;
	if rcnt>0 then
	  return true;
	else 
	  raise exception 'Delete Failed for VW_USER_GRANT- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function vw_user_grant_dq(text, text, text, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION vw_user_grant_dq(text,  text, text, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+