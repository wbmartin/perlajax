\o ./log/CRUD_client.log
/*
-- Security Grants
GRANT ALL ON TABLE client TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_CLIENT', now(), 'Allows users to select client'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_CLIENT', now(), 'Allows users to add records to client');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_CLIENT', now(), 'Allows users to update records in client');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_CLIENT', now(), 'Allows users to delete records from client');
select * from security_privilege where priv_name in ('SELECT_CLIENT','INSERT_CLIENT','UPDATE_CLIENT','DELETE_CLIENT');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: client_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION client_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION client_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF client AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_CLIENT' );
    end if;
--client_id, client_name

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

    return query execute 'select * from client where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION client_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION client_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from client_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: client_bypk(text, integer, text, text )

-- DROP FUNCTION client_pybk(text, integer, text, text);

CREATE OR REPLACE FUNCTION client_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text )
  RETURNS client AS
$BODY$
  Declare
    result client;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_CLIENT' );
    end if;
--client_id, client_name
   


     select * into result from client where client_id=clientId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION client_bypk(text, integer, text, text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION client_bypk(text, integer, text, text) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  client_iq(text, integer, text ,text)

-- DROP FUNCTION client_iq( text, integer, text,text);

create or replace function client_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,clientName_ text)
  returns client as
$body$
  declare
    newrow client;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_CLIENT' );
    end if;


    insert into client(client_id ,client_name) 
	values (clientid_ ,clientName_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function client_iq(text, integer, text, text ,text) owner to postgres;
GRANT EXECUTE ON FUNCTION client_iq(text, integer, text, text ,text) TO GROUP simpledemo;



--select * from client_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  client_uq(text, integer, text ,text)

-- DROP FUNCTION client_uq( text, integer, text ,text);


create or replace function client_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , clientName_ text)
  returns client as
$body$
  declare
    updatedrow client;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_CLIENT' );
    end if;
	update client set client_name= clientName_ 	where client_id=clientId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for CLIENT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function client_uq(text, integer, text, text ,text) owner to postgres;
GRANT EXECUTE ON FUNCTION client_uq(text, integer, text, text ,text) TO GROUP simpledemo;

--select * from client_uq('ALREADY_AUTH', 1, 'test', 'test', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  client_dq(text, integer, text , timestamp)

-- DROP FUNCTION client_dq( text, integer, text , timestamp);


create or replace function client_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text , lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_CLIENT' );
    end if;
	delete from client where client_id=clientId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for CLIENT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function client_dq(text, integer, text, text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION client_dq(text, integer, text, text, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
