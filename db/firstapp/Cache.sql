\o ./log/cache.log
/*
-- Security Grants

INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_CROSS_TABLE_CACHE', now(), 'Required for all users to populate options'); 
select * from security_privilege where priv_name in ('SELECT_CROSS_TABLE_CACHE');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, 10);

*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: cross_table_cache_sq(text, text, text)

-- DROP FUNCTION cross_table_cache_sq(text, text, text);

CREATE OR REPLACE FUNCTION cross_table_cache_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text)
  RETURNS SETOF type_label_value AS
$BODY$
  Declare
    
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_CROSS_TABLE_CACHE' );
    end if;

    return query execute 'select ''golfer''::varchar as tp, name as lbl, golfer_id::varchar as val from golfer ';

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION cross_table_cache_sq(text,  text, text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION cross_table_cache_sq(text, text, text) TO GROUP golfscore;

--select * from cross_table_cache_sq('ALREADY_AUTH',  'test', 'test');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: golfer_bypk(text,  text, text ,integer)

-- DROP FUNCTION golfer_pybk(text,  text, text,integer);

CREATE OR REPLACE FUNCTION golfer_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text ,golferId_ integer)
  RETURNS golfer AS
$BODY$
  Declare
    result golfer;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_GOLFER' );
    end if;
--golfer_id, last_update, name
   


     select * into result from golfer where golfer_id=golferId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION golfer_bypk(text,  text, text,integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION golfer_bypk(text,  text, text,integer) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  golfer_iq(text,  text ,character varying)

-- DROP FUNCTION golfer_iq( text,  text,character varying);

create or replace function golfer_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,name_ character varying)
  returns golfer as
$body$
  declare
    newrow golfer;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_GOLFER' );
    end if;


    insert into golfer( last_update,name) 	values (  now(),name_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golfer_iq(text,  text, text ,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION golfer_iq(text,  text, text ,character varying) TO GROUP golfscore;



--select * from golfer_iq('ALREADY_AUTH', 'test', 'test' , 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  golfer_uq(text, text ,integer,timestamp,character varying)

-- DROP FUNCTION golfer_uq( text,  text ,integer,timestamp,character varying);


create or replace function golfer_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , golferId_ integer, lastUpdate_ timestamp, name_ character varying)
  returns golfer as
$body$
  declare
    updatedrow golfer;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_GOLFER' );
    end if;
	update golfer set last_update = now() ,  name= name_ 	where golfer_id=golferId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for GOLFER- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golfer_uq(text,  text, text ,integer,timestamp,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION golfer_uq(text, text, text ,integer,timestamp,character varying) TO GROUP golfscore;

--select * from golfer_uq('ALREADY_AUTH', 'test', 'test' <last_update>, 'text' <golfer_id>);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  golfer_dq(text, text ,integer, timestamp)

-- DROP FUNCTION golfer_dq( text,  text ,integer, timestamp);


create or replace function golfer_dq(alreadyauth_ text,  userid_ text, sessionid_ text ,golferId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_GOLFER' );
    end if;
	delete from golfer where golfer_id=golferId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for GOLFER- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function golfer_dq(text, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION golfer_dq(text,  text, text,integer, timestamp) TO GROUP golfscore;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+