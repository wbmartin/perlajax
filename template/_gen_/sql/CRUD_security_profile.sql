
-- Function: security_profile_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION security_profile_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_profile_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_profile AS
$BODY$
  Declare
   Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PROFILE' );
    end if;
    return query execute 'select * from security_profile ' ||  buildSQLClauses(whereClause_,orderByClause_,rowLimit_,rowOffset_);  
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
--ALTER FUNCTION security_profile_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_profile_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;
--select * from security_profile_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_profile_bypk(text, text, text ,integer)
-- DROP FUNCTION security_profile_pybk(text, text, text,integer);
--CREATE OR REPLACE FUNCTION security_profile_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--,securityProfileId_ integer)
--  RETURNS security_profile AS
--$BODY$
--  Declare
--    result security_profile;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PROFILE' );
--    end if;
--security_profile_id, profile_name, last_update, updated_by
--     select * into result from security_profile where security_profile_id=securityProfileId_;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION security_profile_bypk(text,  text, text,integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_profile_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_profile_iq(text, text, text ,text)
-- DROP FUNCTION security_profile_iq( text, text, text,text);
create or replace function security_profile_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,profileName_ text)
  returns security_profile as
$body$
  declare
    newrow security_profile;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_SECURITY_PROFILE' );
    end if;


    insert into security_profile( profile_name,last_update,updated_by)  values ( profileName_, now(), securityuserid_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_iq(text,  text, text ,text) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_iq(text,  text, text ,text) TO GROUP golfscore;

--select * from security_profile_iq('ALREADY_AUTH', 'test', 'test' , 'text', 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_profile_uq(text, text, text ,integer,text,timestamp)
-- DROP FUNCTION security_profile_uq(text, text, text ,integer,text,timestamp);

create or replace function security_profile_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , securityProfileId_ integer, profileName_ text, lastUpdate_ timestamp)
  returns security_profile as
$body$
  declare
    updatedrow security_profile;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_SECURITY_PROFILE' );
    end if;
	update security_profile set profile_name= profileName_ ,  last_update = now() , updated_by = securityuserid_	where security_profile_id=securityProfileId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SECURITY_PROFILE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_uq(text,  text, text ,integer,text,timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_uq(text, text, text ,integer,text,timestamp) TO GROUP golfscore;

--select * from security_profile_uq('ALREADY_AUTH', 'test', 'test' <security_profile_id> <last_update>, 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_profile_dq(text, text ,integer, timestamp)
-- DROP FUNCTION security_profile_dq( text,  text ,integer, timestamp);

create or replace function security_profile_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,securityProfileId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PROFILE' );
    end if;
	delete from security_profile where security_profile_id=securityProfileId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PROFILE- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

-- Function:  security_profile_dqw(text, text, text)
-- DROP FUNCTION security_profile_dqw( text,text,text);
create or replace function security_profile_dqw(alreadyauth_ text,  userid_ text, sessionid_ text , whereClause_  )
  returns boolean as
$body$
  declare
  GET DIAGNOSTICS integer_var = ROW_COUNT;  
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PROFILE' );
    end if;
	execute  'delete from security_profile ' ||  buildSQLClauses(whereClause_,'',0,0)  ;
	GET DIAGNOSTICS rcnt = ROW_COUNT;
	if rwcnt>0 then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PROFILE- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function security_profile_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_profile_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+