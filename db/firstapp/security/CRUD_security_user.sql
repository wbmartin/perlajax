\o ./log/CRUD_security_user.log
/*
-- Security Grants
GRANT ALL ON TABLE security_user TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_SECURITY_USER', now(), 'Allows users to select security_user'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_SECURITY_USER', now(), 'Allows users to add records to security_user');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_SECURITY_USER', now(), 'Allows users to update records in security_user');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_SECURITY_USER', now(), 'Allows users to delete records from security_user');
select * from security_privilege where priv_name in ('SELECT_SECURITY_USER','INSERT_SECURITY_USER','UPDATE_SECURITY_USER','DELETE_SECURITY_USER');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_user_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION security_user_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_user_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_user AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_USER' );
    end if;
--client_id, user_id, password_enc, security_profile_id, session_id, session_expire_dt, active_yn, last_update

    additionalWhereClause ='';
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
	additionalWhereClause = trim(leading whereClause_);
	additionalWhereClause = regexp_replace(additionalWhereClause, '^(where|WHERE)','');
	additionalWhereClause = trim(leading additionalWhereClause);
	additionalWhereClause = regexp_replace(additionalWhereClause, '^(and|AND)','');
	additionalWhereClause = ' and( ' || additionalWhereClause || ')';
    end if;
    if orderByClause_ <> '' then
	orderByClause = orderByClause_;
    end if;

    return query execute 'select * from security_user where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION security_user_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_user_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from security_user_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_user_bypk(text, integer, text, text ,text)

-- DROP FUNCTION security_user_pybk(text, integer, text, text,text);

CREATE OR REPLACE FUNCTION security_user_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,userId_ text)
  RETURNS security_user AS
$BODY$
  Declare
    result security_user;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_USER' );
    end if;
--client_id, user_id, password_enc, security_profile_id, session_id, session_expire_dt, active_yn, last_update
   


     select * into result from security_user where client_id=clientId_ and user_id=userId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION security_user_bypk(text, integer, text, text,text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_user_bypk(text, integer, text, text,text) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_user_iq(text, integer, text ,text,text,integer,text,timestamp,character)

-- DROP FUNCTION security_user_iq( text, integer, text,text,text,integer,text,timestamp,character);

create or replace function security_user_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,userId_ text,passwordEnc_ text,securityProfileId_ integer,sessionId_ text,sessionExpireDt_ timestamp,activeYn_ character)
  returns security_user as
$body$
  declare
    newrow security_user;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_SECURITY_USER' );
    end if;


    insert into security_user(client_id ,user_id,password_enc,security_profile_id,session_id,session_expire_dt,active_yn,last_update) 
	values (clientid_ ,userId_,passwordEnc_,securityProfileId_,sessionId_,sessionExpireDt_,activeYn_, now()) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_user_iq(text, integer, text, text ,text,text,integer,text,timestamp,character) owner to postgres;
GRANT EXECUTE ON FUNCTION security_user_iq(text, integer, text, text ,text,text,integer,text,timestamp,character) TO GROUP simpledemo;



--select * from security_user_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text', 'text' ,1, 'text', 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_user_uq(text, integer, text ,text,text,integer,text,timestamp,character,timestamp)

-- DROP FUNCTION security_user_uq( text, integer, text ,text,text,integer,text,timestamp,character,timestamp);


create or replace function security_user_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , userId_ text, passwordEnc_ text, securityProfileId_ integer, sessionId_ text, sessionExpireDt_ timestamp, activeYn_ character, lastUpdate_ timestamp)
  returns security_user as
$body$
  declare
    updatedrow security_user;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_SECURITY_USER' );
    end if;
--session_id= sessionId_ ,  session_expire_dt= sessionExpireDt_ , password_enc= passwordEnc_ ,
	update security_user set   security_profile_id= securityProfileId_ ,    active_yn= activeYn_ ,  last_update = now() 	where client_id=clientId_ and user_id=userId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SECURITY_USER- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_user_uq(text, integer, text, text ,text,text,integer,text,timestamp,character,timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_user_uq(text, integer, text, text ,text,text,integer,text,timestamp,character,timestamp) TO GROUP simpledemo;

--select * from security_user_uq('ALREADY_AUTH', 1, 'test', 'test', 'text', 'text' <last_update> ,1, 'text', 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_user_dq(text, integer, text ,text, timestamp)

-- DROP FUNCTION security_user_dq( text, integer, text ,text, timestamp);


create or replace function security_user_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,userId_ text, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_SECURITY_USER' );
    end if;
	delete from security_user where client_id=clientId_ and user_id=userId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_USER- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_user_dq(text, integer, text, text,text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_user_dq(text, integer, text, text,text, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
