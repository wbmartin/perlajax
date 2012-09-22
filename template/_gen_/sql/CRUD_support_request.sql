
-- Function: support_request_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION support_request_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION support_request_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF support_request AS
$BODY$
  Declare
   Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_SUPPORT_REQUEST' );
    end if;
    return query execute 'select * from support_request ' ||  buildSQLClauses(whereClause_,orderByClause_,rowLimit_,rowOffset_);  
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
--ALTER FUNCTION support_request_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION support_request_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;
--select * from support_request_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: support_request_bypk(text, text, text ,integer)
-- DROP FUNCTION support_request_pybk(text, text, text,integer);
--CREATE OR REPLACE FUNCTION support_request_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--,supportRequestId_ integer)
--  RETURNS support_request AS
--$BODY$
--  Declare
--    result support_request;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_SUPPORT_REQUEST' );
--    end if;
--support_request_id, summary, detailed_description, log_details, solution_description, last_update, updated_by
--     select * into result from support_request where support_request_id=supportRequestId_;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION support_request_bypk(text,  text, text,integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION support_request_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  support_request_iq(text, text, text ,text,text,text,text)
-- DROP FUNCTION support_request_iq( text, text, text,text,text,text,text);
create or replace function support_request_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,summary_ text,detailedDescription_ text,logDetails_ text,solutionDescription_ text)
  returns support_request as
$body$
  declare
    newrow support_request;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_SUPPORT_REQUEST' );
    end if;


    insert into support_request( summary,detailed_description,log_details,solution_description,last_update,updated_by)  values ( summary_,detailedDescription_,logDetails_,solutionDescription_, now(), securityuserid_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function support_request_iq(text,  text, text ,text,text,text,text) owner to postgres;
--GRANT EXECUTE ON FUNCTION support_request_iq(text,  text, text ,text,text,text,text) TO GROUP golfscore;

--select * from support_request_iq('ALREADY_AUTH', 'test', 'test' , 'text', 'text', 'text', 'text', 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  support_request_uq(text, text, text ,integer,text,text,text,text,timestamp)
-- DROP FUNCTION support_request_uq(text, text, text ,integer,text,text,text,text,timestamp);

create or replace function support_request_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , supportRequestId_ integer, summary_ text, detailedDescription_ text, logDetails_ text, solutionDescription_ text, lastUpdate_ timestamp)
  returns support_request as
$body$
  declare
    updatedrow support_request;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_SUPPORT_REQUEST' );
    end if;
	update support_request set summary= summary_ ,  detailed_description= detailedDescription_ ,  log_details= logDetails_ ,  solution_description= solutionDescription_ ,  last_update = now() , updated_by = securityuserid_	where support_request_id=supportRequestId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SUPPORT_REQUEST- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function support_request_uq(text,  text, text ,integer,text,text,text,text,timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION support_request_uq(text, text, text ,integer,text,text,text,text,timestamp) TO GROUP golfscore;

--select * from support_request_uq('ALREADY_AUTH', 'test', 'test', 'text', 'text', 'text' <last_update>, 'text' <support_request_id>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  support_request_dq(text, text ,integer, timestamp)
-- DROP FUNCTION support_request_dq( text,  text ,integer, timestamp);

create or replace function support_request_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,supportRequestId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SUPPORT_REQUEST' );
    end if;
	delete from support_request where support_request_id=supportRequestId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SUPPORT_REQUEST- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function support_request_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION support_request_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

-- Function:  support_request_dqw(text, text, text)
-- DROP FUNCTION support_request_dqw( text,text,text);
create or replace function support_request_dqw(alreadyauth_ text,  userid_ text, sessionid_ text , whereClause_ text )
  returns boolean as
$body$
  declare
  rcnt int;  
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_SUPPORT_REQUEST' );
    end if;
	execute  'delete from support_request ' ||  buildSQLClauses(whereClause_,'',0,0)  ;
	GET DIAGNOSTICS rcnt = ROW_COUNT;
	if rcnt>0 then
	  return true;
	else 
	  raise exception 'Delete Failed for SUPPORT_REQUEST- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
--alter function support_request_dq(text, text, text,integer, timestamp) owner to postgres;
--GRANT EXECUTE ON FUNCTION support_request_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+