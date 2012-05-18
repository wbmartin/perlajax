\o ./log/CRUD_security_profile.log
/*
-- Security Grants
GRANT ALL ON TABLE security_profile TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_SECURITY_PROFILE', now(), 'Allows users to select security_profile'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_SECURITY_PROFILE', now(), 'Allows users to add records to security_profile');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_SECURITY_PROFILE', now(), 'Allows users to update records in security_profile');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_SECURITY_PROFILE', now(), 'Allows users to delete records from security_profile');
select * from security_privilege where priv_name in ('SELECT_SECURITY_PROFILE','INSERT_SECURITY_PROFILE','UPDATE_SECURITY_PROFILE','DELETE_SECURITY_PROFILE');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_profile_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION security_profile_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_profile_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_profile AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_PROFILE' );
    end if;
--client_id, security_profile_id, profile_name, last_update

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

    return query execute 'select * from security_profile where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION security_profile_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_profile_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from security_profile_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_profile_bypk(text, integer, text, text ,integer)

-- DROP FUNCTION security_profile_pybk(text, integer, text, text,integer);

CREATE OR REPLACE FUNCTION security_profile_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,securityProfileId_ integer)
  RETURNS security_profile AS
$BODY$
  Declare
    result security_profile;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_PROFILE' );
    end if;
--client_id, security_profile_id, profile_name, last_update
   


     select * into result from security_profile where client_id=clientId_ and security_profile_id=securityProfileId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION security_profile_bypk(text, integer, text, text,integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_profile_bypk(text, integer, text, text,integer) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_profile_iq(text, integer, text ,text)

-- DROP FUNCTION security_profile_iq( text, integer, text,text);

create or replace function security_profile_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,profileName_ text)
  returns security_profile as
$body$
  declare
    newrow security_profile;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_SECURITY_PROFILE' );
    end if;


    insert into security_profile(client_id ,profile_name,last_update) 
	values (clientid_ ,profileName_, now()) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_profile_iq(text, integer, text, text ,text) owner to postgres;
GRANT EXECUTE ON FUNCTION security_profile_iq(text, integer, text, text ,text) TO GROUP simpledemo;



--select * from security_profile_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_profile_uq(text, integer, text ,integer,text,timestamp)

-- DROP FUNCTION security_profile_uq( text, integer, text ,integer,text,timestamp);


create or replace function security_profile_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , securityProfileId_ integer, profileName_ text, lastUpdate_ timestamp)
  returns security_profile as
$body$
  declare
    updatedrow security_profile;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_SECURITY_PROFILE' );
    end if;
	update security_profile set profile_name= profileName_ ,  last_update = now() 	where client_id=clientId_ and security_profile_id=securityProfileId_   and   last_update = lastUpdate_
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
alter function security_profile_uq(text, integer, text, text ,integer,text,timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_profile_uq(text, integer, text, text ,integer,text,timestamp) TO GROUP simpledemo;

--select * from security_profile_uq('ALREADY_AUTH', 1, 'test', 'test' <security_profile_id> <last_update>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_profile_dq(text, integer, text ,integer, timestamp)

-- DROP FUNCTION security_profile_dq( text, integer, text ,integer, timestamp);


create or replace function security_profile_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,securityProfileId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_SECURITY_PROFILE' );
    end if;
	delete from security_profile where client_id=clientId_ and security_profile_id=securityProfileId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PROFILE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_profile_dq(text, integer, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_profile_dq(text, integer, text, text,integer, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
