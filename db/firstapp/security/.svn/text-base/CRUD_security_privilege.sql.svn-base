\o ./log/CRUD_security_privilege.log
/*
-- Security Grants
GRANT ALL ON TABLE security_privilege TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_SECURITY_PRIVILEGE', now(), 'Allows users to select security_privilege'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_SECURITY_PRIVILEGE', now(), 'Allows users to add records to security_privilege');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_SECURITY_PRIVILEGE', now(), 'Allows users to update records in security_privilege');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_SECURITY_PRIVILEGE', now(), 'Allows users to delete records from security_privilege');
select * from security_privilege where priv_name in ('SELECT_SECURITY_PRIVILEGE','INSERT_SECURITY_PRIVILEGE','UPDATE_SECURITY_PRIVILEGE','DELETE_SECURITY_PRIVILEGE');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_privilege_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION security_privilege_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION security_privilege_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF security_privilege AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_PRIVILEGE' );
    end if;
--client_id, security_privilege_id, priv_name, description, last_update

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

    return query execute 'select * from security_privilege where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION security_privilege_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_privilege_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from security_privilege_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: security_privilege_bypk(text, integer, text, text ,integer)

-- DROP FUNCTION security_privilege_pybk(text, integer, text, text,integer);

CREATE OR REPLACE FUNCTION security_privilege_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,securityPrivilegeId_ integer)
  RETURNS security_privilege AS
$BODY$
  Declare
    result security_privilege;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SECURITY_PRIVILEGE' );
    end if;
--client_id, security_privilege_id, priv_name, description, last_update
   


     select * into result from security_privilege where client_id=clientId_ and security_privilege_id=securityPrivilegeId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION security_privilege_bypk(text, integer, text, text,integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION security_privilege_bypk(text, integer, text, text,integer) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  security_privilege_iq(text, integer, text ,text,text)

-- DROP FUNCTION security_privilege_iq( text, integer, text,text,text);

create or replace function security_privilege_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,privName_ text,description_ text)
  returns security_privilege as
$body$
  declare
    newrow security_privilege;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_SECURITY_PRIVILEGE' );
    end if;


    insert into security_privilege(client_id ,priv_name,description,last_update) 
	values (clientid_ ,privName_,description_, now()) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_privilege_iq(text, integer, text, text ,text,text) owner to postgres;
GRANT EXECUTE ON FUNCTION security_privilege_iq(text, integer, text, text ,text,text) TO GROUP simpledemo;



--select * from security_privilege_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  security_privilege_uq(text, integer, text ,integer,text,text,timestamp)

-- DROP FUNCTION security_privilege_uq( text, integer, text ,integer,text,text,timestamp);


create or replace function security_privilege_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , securityPrivilegeId_ integer, privName_ text, description_ text, lastUpdate_ timestamp)
  returns security_privilege as
$body$
  declare
    updatedrow security_privilege;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_SECURITY_PRIVILEGE' );
    end if;
	update security_privilege set priv_name= privName_ ,  description= description_ ,  last_update = now() 	where client_id=clientId_ and security_privilege_id=securityPrivilegeId_   and   last_update = lastUpdate_
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
alter function security_privilege_uq(text, integer, text, text ,integer,text,text,timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_privilege_uq(text, integer, text, text ,integer,text,text,timestamp) TO GROUP simpledemo;

--select * from security_privilege_uq('ALREADY_AUTH', 1, 'test', 'test', 'text' <security_privilege_id> <last_update>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  security_privilege_dq(text, integer, text ,integer, timestamp)

-- DROP FUNCTION security_privilege_dq( text, integer, text ,integer, timestamp);


create or replace function security_privilege_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,securityPrivilegeId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_SECURITY_PRIVILEGE' );
    end if;
	delete from security_privilege where client_id=clientId_ and security_privilege_id=securityPrivilegeId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SECURITY_PRIVILEGE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function security_privilege_dq(text, integer, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION security_privilege_dq(text, integer, text, text,integer, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
