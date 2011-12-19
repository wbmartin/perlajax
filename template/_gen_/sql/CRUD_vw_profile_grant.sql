\o ./log/CRUD_vw_profile_grant.log
/*
-- Security Grants
GRANT ALL ON TABLE vw_profile_grant TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_VW_PROFILE_GRANT', now(), 'Allows users to select vw_profile_grant'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_VW_PROFILE_GRANT', now(), 'Allows users to add records to vw_profile_grant');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_VW_PROFILE_GRANT', now(), 'Allows users to update records in vw_profile_grant');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_VW_PROFILE_GRANT', now(), 'Allows users to delete records from vw_profile_grant');
select * from security_privilege where priv_name in ('SELECT_VW_PROFILE_GRANT','INSERT_VW_PROFILE_GRANT','UPDATE_VW_PROFILE_GRANT','DELETE_VW_PROFILE_GRANT');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_profile_grant_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION vw_profile_grant_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION vw_profile_grant_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF vw_profile_grant AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_VW_PROFILE_GRANT' );
    end if;
--client_id, security_profile_id, profile_name, security_privilege_id, priv_name, last_update

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

    return query execute 'select * from vw_profile_grant where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION vw_profile_grant_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from vw_profile_grant_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_profile_grant_bypk(text, integer, text, text )

-- DROP FUNCTION vw_profile_grant_pybk(text, integer, text, text);

CREATE OR REPLACE FUNCTION vw_profile_grant_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text )
  RETURNS vw_profile_grant AS
$BODY$
  Declare
    result vw_profile_grant;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_VW_PROFILE_GRANT' );
    end if;
--client_id, security_profile_id, profile_name, security_privilege_id, priv_name, last_update
   


     select * into result from vw_profile_grant where ;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION vw_profile_grant_bypk(text, integer, text, text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_bypk(text, integer, text, text) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  vw_profile_grant_iq(text, integer, text ,integer,text,integer,text)

-- DROP FUNCTION vw_profile_grant_iq( text, integer, text,integer,text,integer,text);

create or replace function vw_profile_grant_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,securityProfileId_ integer,profileName_ text,securityPrivilegeId_ integer,privName_ text)
  returns vw_profile_grant as
$body$
  declare
    newrow vw_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_VW_PROFILE_GRANT' );
    end if;


    insert into vw_profile_grant(client_id ,security_profile_id,profile_name,security_privilege_id,priv_name,last_update) 
	values (clientid_ ,securityProfileId_,profileName_,securityPrivilegeId_,privName_, now()) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_profile_grant_iq(text, integer, text, text ,integer,text,integer,text) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_iq(text, integer, text, text ,integer,text,integer,text) TO GROUP simpledemo;



--select * from vw_profile_grant_iq('ALREADY_AUTH', 1, 'test', 'test'  ,1, 'text' ,1, 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  vw_profile_grant_uq(text, integer, text ,integer,text,integer,text,timestamp)

-- DROP FUNCTION vw_profile_grant_uq( text, integer, text ,integer,text,integer,text,timestamp);


create or replace function vw_profile_grant_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , securityProfileId_ integer, profileName_ text, securityPrivilegeId_ integer, privName_ text, lastUpdate_ timestamp)
  returns vw_profile_grant as
$body$
  declare
    updatedrow vw_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_VW_PROFILE_GRANT' );
    end if;
	update vw_profile_grant set client_id= clientId_ ,  security_profile_id= securityProfileId_ ,  profile_name= profileName_ ,  security_privilege_id= securityPrivilegeId_ ,  priv_name= privName_ ,  last_update = now() 	where    and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for VW_PROFILE_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_profile_grant_uq(text, integer, text, text ,integer,text,integer,text,timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_uq(text, integer, text, text ,integer,text,integer,text,timestamp) TO GROUP simpledemo;

--select * from vw_profile_grant_uq('ALREADY_AUTH', 1, 'test', 'test', 'text' ,1 ,1 <last_update>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  vw_profile_grant_dq(text, integer, text , timestamp)

-- DROP FUNCTION vw_profile_grant_dq( text, integer, text , timestamp);


create or replace function vw_profile_grant_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text , lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_VW_PROFILE_GRANT' );
    end if;
	delete from vw_profile_grant where   and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for VW_PROFILE_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_profile_grant_dq(text, integer, text, text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_dq(text, integer, text, text, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
