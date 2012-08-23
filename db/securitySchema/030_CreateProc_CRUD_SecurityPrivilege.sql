
-- Function: security_privilege_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION security_privilege_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_privilege_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_privilege AS
$BODY$
  Declare
   Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PRIVILEGE' );
    end if;
    return query execute 'select * from security_privilege ' ||  buildSQLClauses(whereClause_,orderByClause_,rowLimit_,rowOffset_);  
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
--ALTER FUNCTION security_privilege_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;
--select * from security_privilege_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_privilege_bypk(text, text, text ,integer)
-- DROP FUNCTION security_privilege_pybk(text, text, text,integer);
--CREATE OR REPLACE FUNCTION security_privilege_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--,securityPrivilegeId_ integer)
--  RETURNS security_privilege AS
--$BODY$
--  Declare
--    result security_privilege;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_SECURITY_PRIVILEGE' );
--    end if;
--security_privilege_id, priv_name, description, last_update, updated_by
--     select * into result from security_privilege where security_privilege_id=securityPrivilegeId_;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION security_privilege_bypk(text,  text, text,integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_privilege_iq(text, text, text ,integer,text,text)
-- DROP FUNCTION security_privilege_iq( text, text, text,integer,text,text);
/* wbmartin 2012-08-22 | select is only UI proc
create or replace function security_privilege_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,securityPrivilegeId_ integer,privName_ text,description_ text)
  returns security_privilege as
$body$
  declare
    newrow security_privilege;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_SECURITY_PRIVILEGE' );
    end if;


    insert into security_privilege( security_privilege_id,priv_name,description,last_update,updated_by)  values ( securityPrivilegeId_,privName_,description_, now(), securityuserid_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
	*/
--alter function security_privilege_iq(text,  text, text ,integer,text,text) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_iq(text,  text, text ,integer,text,text) TO GROUP golfscore;

--select * from security_privilege_iq('ALREADY_AUTH', 'test', 'test'  ,1, 'text', 'text', 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_privilege_uq(text, text, text ,integer,text,text,timestamp)
-- DROP FUNCTION security_privilege_uq(text, text, text ,integer,text,text,timestamp);
/* wbmartin 2012-08-22 | select is only UI proc
create or replace function security_privilege_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , securityPrivilegeId_ integer, privName_ text, description_ text, lastUpdate_ timestamp)
  returns security_privilege as
$body$
  declare
    updatedrow security_privilege;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_SECURITY_PRIVILEGE' );
    end if;
	update security_privilege set priv_name= privName_ ,  description= description_ ,  last_update = now() , updated_by = securityuserid_	where security_privilege_id=securityPrivilegeId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SECURITY_PRIVILEGE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
	*/
--alter function security_privilege_uq(text,  text, text ,integer,text,text,timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_uq(text, text, text ,integer,text,text,timestamp) TO GROUP golfscore;

--select * from security_privilege_uq('ALREADY_AUTH', 'test', 'test', 'text' ,1 <last_update>, 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_privilege_dq(text, text ,integer, timestamp)
-- DROP FUNCTION security_privilege_dq( text,  text ,integer, timestamp);
/* wbmartin 2012-08-22 | select is only UI proc
create or replace function security_privilege_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,securityPrivilegeId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PRIVILEGE' );
    end if;
	delete from security_privilege where security_privilege_id=securityPrivilegeId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PRIVILEGE- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
	*/
--alter function security_privilege_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

-- Function:  security_privilege_dqw(text, text, text)
-- DROP FUNCTION security_privilege_dqw( text,text,text);
/* wbmartin 2012-08-22 | select is only UI proc
create or replace function security_privilege_dqw(alreadyauth_ text,  userid_ text, sessionid_ text , whereClause_ text )
  returns boolean as
$body$
  declare
  rcnt int;  
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SECURITY_PRIVILEGE' );
    end if;
	execute  'delete from security_privilege ' ||  buildSQLClauses(whereClause_,'',0,0)  ;
	GET DIAGNOSTICS rcnt = ROW_COUNT;
	if rcnt>0 then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PRIVILEGE- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
	*/
--alter function security_privilege_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION security_privilege_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
