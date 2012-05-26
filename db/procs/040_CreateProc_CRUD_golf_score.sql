
-- Function: golf_score_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION golf_score_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION golf_score_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF golf_score AS
$BODY$
  Declare
    whereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_GOLF_SCORE' );
    end if;
--golf_score_id, last_update, updated_by, golf_score, golfer_id, game_dt

    whereClause ='';
    orderByClause='';
    offsetStatement ='';
    limitStatement ='';
    if rowOffset_ >0 then
	offsetStatement =' offset ' || rowOffset_ ;
    end if;
    if rowLimit_ >0 then
	limitStatement =' limit '||rowLimit_;
    end if;
    if whereClause_ <>'' then
	whereClause = trim(leading whereClause_);
	whereClause = regexp_replace(whereClause, '^(where|WHERE)','');
        whereClause = ' where ' || whereClause;
    end if;
    if orderByClause_ <> '' then
	orderByClause = orderByClause_;
    end if;

    return query execute 'select * from golf_score '
	|| whereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION golf_score_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION golf_score_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;

--select * from golf_score_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: golf_score_bypk(text, text, text ,integer)

-- DROP FUNCTION golf_score_pybk(text, text, text,integer);

--CREATE OR REPLACE FUNCTION golf_score_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text 
--,golfScoreId_ integer)
--  RETURNS golf_score AS
--$BODY$
--  Declare
--    result golf_score;
--  Begin
--    if alreadyAuth_ <>'ALREADY_AUTH' then
--    	perform isSessionValid( securityuserId_,sessionId_) ;
--    	perform isUserAuthorized( securityuserId_, 'SELECT_GOLF_SCORE' );
--    end if;
--golf_score_id, last_update, updated_by, golf_score, golfer_id, game_dt
--     select * into result from golf_score where golf_score_id=golfScoreId_;
--     return result;
--  End;
--$BODY$
--  LANGUAGE 'plpgsql' VOLATILE
--  COST 100;
--ALTER FUNCTION golf_score_bypk(text,  text, text,integer) OWNER TO postgres;
--GRANT EXECUTE ON FUNCTION golf_score_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  golf_score_iq(text, text, text ,integer,integer,date)

-- DROP FUNCTION golf_score_iq( text, text, text,integer,integer,date);

create or replace function golf_score_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,golfScore_ integer,golferId_ integer,gameDt_ date)
  returns golf_score as
$body$
  declare
    newrow golf_score;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_GOLF_SCORE' );
    end if;


    insert into golf_score( last_update,updated_by,golf_score,golfer_id,game_dt)  values (  now(), securityuserid_,golfScore_,golferId_,gameDt_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golf_score_iq(text,  text, text ,integer,integer,date) owner to postgres;
GRANT EXECUTE ON FUNCTION golf_score_iq(text,  text, text ,integer,integer,date) TO GROUP golfscore;

--select * from golf_score_iq('ALREADY_AUTH', 'test', 'test' , 'text' ,1 ,1, 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  golf_score_uq(text, text, text ,integer,timestamp,integer,integer,date)

-- DROP FUNCTION golf_score_uq(text, text, text ,integer,timestamp,integer,integer,date);


create or replace function golf_score_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , golfScoreId_ integer, lastUpdate_ timestamp, golfScore_ integer, golferId_ integer, gameDt_ date)
  returns golf_score as
$body$
  declare
    updatedrow golf_score;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_GOLF_SCORE' );
    end if;
	update golf_score set last_update = now() , updated_by = securityuserid_,  golf_score= golfScore_ ,  golfer_id= golferId_ ,  game_dt= gameDt_ 	where golf_score_id=golfScoreId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for GOLF_SCORE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golf_score_uq(text,  text, text ,integer,timestamp,integer,integer,date) owner to postgres;
GRANT EXECUTE ON FUNCTION golf_score_uq(text, text, text ,integer,timestamp,integer,integer,date) TO GROUP golfscore;

--select * from golf_score_uq('ALREADY_AUTH', 'test', 'test', 'text' <golf_score_id> <last_update> ,1, 'text' ,1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  golf_score_dq(text, text ,integer, timestamp)
-- DROP FUNCTION golf_score_dq( text,  text ,integer, timestamp);

create or replace function golf_score_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,golfScoreId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_GOLF_SCORE' );
    end if;
	delete from golf_score where golf_score_id=golfScoreId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for GOLF_SCORE- The record may have been changed or deleted before the attempt.';
	end if;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golf_score_dq(text, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION golf_score_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
