
-- Function: security_profile_grant_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION security_profile_grant_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_profile_grant_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_profile_grant AS
$BODY$
  Declare
   Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PROFILE_GRANT' );
    end if;
    return query execute 'select * from security_profile_grant ' ||  buildSQLClauses(whereClause_,orderByClause_,rowLimit_,rowOffset_);  
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
--ALTER FUNCTION security_profile_grant_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;
--select * from security_profile_grant_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_profile_grant_bypk(text, text, text ,integer)
-- DROP FUNCTION security_profile_grant_pybk(text, text, text,integer);
--CREATE OR REPLACE FUNCTION security_profile_grant_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--,securityProfileGrantId_ integer)
--  RETURNS security_profile_grant AS
--$BODY$
--  Declare
--    result security_profile_grant;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PROFILE_GRANT' );
--    end if;
--security_profile_grant_id, security_privilege_id, security_profile_id, last_update, updated_by
--     select * into result from security_profile_grant where security_profile_grant_id=securityProfileGrantId_;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION security_profile_grant_bypk(text,  text, text,integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_profile_grant_iq(text, text, text ,integer,integer)
-- DROP FUNCTION security_profile_grant_iq( text, text, text,integer,integer);
create or replace function security_profile_grant_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,securityPrivilegeId_ integer,securityProfileId_ integer)
  returns security_profile_grant as
$body$
  declare
    newrow security_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_SECURITY_PROFILE_GRANT' );
    end if;


    insert into security_profile_grant( security_privilege_id,security_profile_id,last_update,updated_by)  values ( securityPrivilegeId_,securityProfileId_, now(), securityuserid_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_grant_iq(text,  text, text ,integer,integer) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_iq(text,  text, text ,integer,integer) TO GROUP golfscore;

--select * from security_profile_grant_iq('ALREADY_AUTH', 'test', 'test'  ,1 ,1, 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_profile_grant_uq(text, text, text ,integer,integer,integer,timestamp with time zone)
-- DROP FUNCTION security_profile_grant_uq(text, text, text ,integer,integer,integer,timestamp with time zone);

create or replace function security_profile_grant_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , securityProfileGrantId_ integer, securityPrivilegeId_ integer, securityProfileId_ integer, lastUpdate_ timestamp with time zone)
  returns security_profile_grant as
$body$
  declare
    updatedrow security_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_SECURITY_PROFILE_GRANT' );
    end if;
	update security_profile_grant set security_privilege_id= securityPrivilegeId_ ,  security_profile_id= securityProfileId_ ,  last_update = now() , updated_by = securityuserid_	where security_profile_grant_id=securityProfileGrantId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SECURITY_PROFILE_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_grant_uq(text,  text, text ,integer,integer,integer,timestamp with time zone) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_uq(text, text, text ,integer,integer,integer,timestamp with time zone) TO GROUP golfscore;

--select * from security_profile_grant_uq('ALREADY_AUTH', 'test', 'test' ,1 ,1 <last_update> <security_profile_grant_id>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_profile_grant_dq(text, text ,integer, timestamp)
-- DROP FUNCTION security_profile_grant_dq( text,  text ,integer, timestamp);

create or replace function security_profile_grant_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,securityProfileGrantId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PROFILE_GRANT' );
    end if;
	delete from security_profile_grant where security_profile_grant_id=securityProfileGrantId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PROFILE_GRANT- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_grant_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

-- Function:  security_profile_grant_dqw(text, text, text)
-- DROP FUNCTION security_profile_grant_dqw( text,text,text);
create or replace function security_profile_grant_dqw(alreadyauth_ text,  userid_ text, sessionid_ text , whereClause_  )
  returns boolean as
$body$
  declare
  GET DIAGNOSTICS integer_var = ROW_COUNT;  
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PROFILE_GRANT' );
    end if;
	execute  'delete from security_profile_grant ' ||  buildSQLClauses(whereClause_,'',0,0)  ;
	GET DIAGNOSTICS rcnt = ROW_COUNT;
	if rwcnt>0 then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PROFILE_GRANT- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_grant_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_grant_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+