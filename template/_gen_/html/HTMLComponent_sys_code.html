\o ./log/CRUD_sys_code.log
/*
-- Security Grants
GRANT ALL ON TABLE sys_code TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_SYS_CODE', now(), 'Allows users to select sys_code'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_SYS_CODE', now(), 'Allows users to add records to sys_code');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_SYS_CODE', now(), 'Allows users to update records in sys_code');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_SYS_CODE', now(), 'Allows users to delete records from sys_code');
select * from security_privilege where priv_name in ('SELECT_SYS_CODE','INSERT_SYS_CODE','UPDATE_SYS_CODE','DELETE_SYS_CODE');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: sys_code_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION sys_code_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION sys_code_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF sys_code AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SYS_CODE' );
    end if;
--sys_code_id, client_id, code_type, key, value, last_update, notes

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

    return query execute 'select * from sys_code where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION sys_code_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION sys_code_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from sys_code_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: sys_code_bypk(text, integer, text, text ,integer)

-- DROP FUNCTION sys_code_pybk(text, integer, text, text,integer);

CREATE OR REPLACE FUNCTION sys_code_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,sysCodeId_ integer)
  RETURNS sys_code AS
$BODY$
  Declare
    result sys_code;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_SYS_CODE' );
    end if;
--sys_code_id, client_id, code_type, key, value, last_update, notes
   


     select * into result from sys_code where sys_code_id=sysCodeId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION sys_code_bypk(text, integer, text, text,integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION sys_code_bypk(text, integer, text, text,integer) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  sys_code_iq(text, integer, text ,character varying,character varying,character varying,character varying)

-- DROP FUNCTION sys_code_iq( text, integer, text,character varying,character varying,character varying,character varying);

create or replace function sys_code_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,codeType_ character varying,key_ character varying,value_ character varying,notes_ character varying)
  returns sys_code as
$body$
  declare
    newrow sys_code;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_SYS_CODE' );
    end if;


    insert into sys_code(client_id ,code_type,key,value,last_update,notes) 
	values (clientid_ ,codeType_,key_,value_, now(),notes_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function sys_code_iq(text, integer, text, text ,character varying,character varying,character varying,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION sys_code_iq(text, integer, text, text ,character varying,character varying,character varying,character varying) TO GROUP simpledemo;



--select * from sys_code_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text', 'text', 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  sys_code_uq(text, integer, text ,integer,character varying,character varying,character varying,timestamp,character varying)

-- DROP FUNCTION sys_code_uq( text, integer, text ,integer,character varying,character varying,character varying,timestamp,character varying);


create or replace function sys_code_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , sysCodeId_ integer, codeType_ character varying, key_ character varying, value_ character varying, lastUpdate_ timestamp, notes_ character varying)
  returns sys_code as
$body$
  declare
    updatedrow sys_code;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_SYS_CODE' );
    end if;
	update sys_code set client_id= clientId_ ,  code_type= codeType_ ,  key= key_ ,  value= value_ ,  last_update = now() ,  notes= notes_ 	where sys_code_id=sysCodeId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for SYS_CODE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function sys_code_uq(text, integer, text, text ,integer,character varying,character varying,character varying,timestamp,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION sys_code_uq(text, integer, text, text ,integer,character varying,character varying,character varying,timestamp,character varying) TO GROUP simpledemo;

--select * from sys_code_uq('ALREADY_AUTH', 1, 'test', 'test' <sys_code_id>, 'text' <last_update>, 'text', 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  sys_code_dq(text, integer, text ,integer, timestamp)

-- DROP FUNCTION sys_code_dq( text, integer, text ,integer, timestamp);


create or replace function sys_code_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,sysCodeId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_SYS_CODE' );
    end if;
	delete from sys_code where sys_code_id=sysCodeId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for SYS_CODE- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function sys_code_dq(text, integer, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION sys_code_dq(text, integer, text, text,integer, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
