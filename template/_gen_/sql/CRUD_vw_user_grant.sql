\o ./log/CRUD_vw_user_grant.log
/*
-- Security Grants
GRANT ALL ON TABLE vw_user_grant TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_VW_USER_GRANT', now(), 'Allows users to select vw_user_grant'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_VW_USER_GRANT', now(), 'Allows users to add records to vw_user_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_VW_USER_GRANT', now(), 'Allows users to update records in vw_user_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_VW_USER_GRANT', now(), 'Allows users to delete records from vw_user_grant');
select * from security_privilege where priv_name in ('SELECT_VW_USER_GRANT','INSERT_VW_USER_GRANT','UPDATE_VW_USER_GRANT','DELETE_VW_USER_GRANT');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_user_grant_sq(text, text, text, text, text, integer, integer)

-- DROP FUNCTION vw_user_grant_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION vw_user_grant_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF vw_user_grant AS
$BODY$
  Declare
    whereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_USER_GRANT' );
    end if;
--user_id, profile_name, priv_name

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

    return query execute 'select * from vw_user_grant '
	|| whereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION vw_user_grant_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_user_grant_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;

--select * from vw_user_grant_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_user_grant_bypk(text,  text, text )

-- DROP FUNCTION vw_user_grant_pybk(text,  text, text);

CREATE OR REPLACE FUNCTION vw_user_grant_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text )
  RETURNS vw_user_grant AS
$BODY$
  Declare
    result vw_user_grant;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_USER_GRANT' );
    end if;
--user_id, profile_name, priv_name
   


     select * into result from vw_user_grant where ;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION vw_user_grant_bypk(text,  text, text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_user_grant_bypk(text,  text, text) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  vw_user_grant_iq(text, text, text ,text,text,text)

-- DROP FUNCTION vw_user_grant_iq( text, text, text,text,text,text);

create or replace function vw_user_grant_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,userId_ text,profileName_ text,privName_ text)
  returns vw_user_grant as
$body$
  declare
    newrow vw_user_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_VW_USER_GRANT' );
    end if;


    insert into vw_user_grant( user_id,profile_name,priv_name) 	values ( userId_,profileName_,privName_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_user_grant_iq(text,  text, text ,text,text,text) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_user_grant_iq(text,  text, text ,text,text,text) TO GROUP golfscore;



--select * from vw_user_grant_iq('ALREADY_AUTH', 'test', 'test' , 'text', 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  vw_user_grant_uq(text, text ,text,text,text)

-- DROP FUNCTION vw_user_grant_uq( text,  text ,text,text,text);


create or replace function vw_user_grant_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , userId_ text, profileName_ text, privName_ text)
  returns vw_user_grant as
$body$
  declare
    updatedrow vw_user_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_VW_USER_GRANT' );
    end if;
	update vw_user_grant set user_id= userId_ ,  profile_name= profileName_ ,  priv_name= privName_ 	where    and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for VW_USER_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_user_grant_uq(text,  text, text ,text,text,text) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_user_grant_uq(text, text, text ,text,text,text) TO GROUP golfscore;

--select * from vw_user_grant_uq('ALREADY_AUTH', 'test', 'test', 'text', 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  vw_user_grant_dq(text, text , timestamp)

-- DROP FUNCTION vw_user_grant_dq( text,  text , timestamp);


create or replace function vw_user_grant_dq(alreadyauth_ text,  userid_ text, sessionid_ text , lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_VW_USER_GRANT' );
    end if;
	delete from vw_user_grant where   and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for VW_USER_GRANT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_user_grant_dq(text, text, text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_user_grant_dq(text,  text, text, timestamp) TO GROUP golfscore;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
