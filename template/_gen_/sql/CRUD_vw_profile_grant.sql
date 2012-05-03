
-- Function: vw_profile_grant_sq(text, text, text, text, text, integer, integer)
-- DROP FUNCTION vw_profile_grant_sq(text, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION vw_profile_grant_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF vw_profile_grant AS
$BODY$
  Declare
    whereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_PROFILE_GRANT' );
    end if;
--security_profile_id, profile_name, security_privilege_id, priv_name, last_update

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

    return query execute 'select * from vw_profile_grant '
	|| whereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION vw_profile_grant_sq(text,  text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_sq(text, text, text, text, text, integer, integer) TO GROUP golfscore;

--select * from vw_profile_grant_sq('ALREADY_AUTH',  'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: vw_profile_grant_bypk(text,  text, text )

-- DROP FUNCTION vw_profile_grant_pybk(text,  text, text);

CREATE OR REPLACE FUNCTION vw_profile_grant_bypk(alreadyAuth_ text,  securityuserid_ text, sessionid_ text )
  RETURNS vw_profile_grant AS
$BODY$
  Declare
    result vw_profile_grant;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_VW_PROFILE_GRANT' );
    end if;
--security_profile_id, profile_name, security_privilege_id, priv_name, last_update
   


     select * into result from vw_profile_grant where ;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION vw_profile_grant_bypk(text,  text, text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_bypk(text,  text, text) TO GROUP golfscore;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  vw_profile_grant_iq(text, text, text ,integer,text,integer,text)

-- DROP FUNCTION vw_profile_grant_iq( text, text, text,integer,text,integer,text);

create or replace function vw_profile_grant_iq(alreadyauth_ text, securityuserid_ text, sessionid_ text,securityProfileId_ integer,profileName_ text,securityPrivilegeId_ integer,privName_ text)
  returns vw_profile_grant as
$body$
  declare
    newrow vw_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_,'INSERT_VW_PROFILE_GRANT' );
    end if;


    insert into vw_profile_grant( security_profile_id,profile_name,security_privilege_id,priv_name,last_update) 	values ( securityProfileId_,profileName_,securityPrivilegeId_,privName_, now()) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function vw_profile_grant_iq(text,  text, text ,integer,text,integer,text) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_iq(text,  text, text ,integer,text,integer,text) TO GROUP golfscore;

--select * from vw_profile_grant_iq('ALREADY_AUTH', 'test', 'test'  ,1, 'text' ,1, 'text' );
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  vw_profile_grant_uq(text, text, text ,integer,text,integer,text,timestamp with time zone)

-- DROP FUNCTION vw_profile_grant_uq(text, text, text ,integer,text,integer,text,timestamp with time zone);


create or replace function vw_profile_grant_uq(alreadyauth_ text,  securityuserid_ text, sessionid_ text , securityProfileId_ integer, profileName_ text, securityPrivilegeId_ integer, privName_ text, lastUpdate_ timestamp with time zone)
  returns vw_profile_grant as
$body$
  declare
    updatedrow vw_profile_grant;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( securityuserid_,sessionid_) ;
    	perform isuserauthorized( securityuserid_, 'UPDATE_VW_PROFILE_GRANT' );
    end if;
	update vw_profile_grant set security_profile_id= securityProfileId_ ,  profile_name= profileName_ ,  security_privilege_id= securityPrivilegeId_ ,  priv_name= privName_ ,  last_update = now() 	where    and   last_update = lastUpdate_
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
alter function vw_profile_grant_uq(text,  text, text ,integer,text,integer,text,timestamp with time zone) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_uq(text, text, text ,integer,text,integer,text,timestamp with time zone) TO GROUP golfscore;

--select * from vw_profile_grant_uq('ALREADY_AUTH', 'test', 'test', 'text' ,1 ,1 <last_update>, 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  vw_profile_grant_dq(text, text , timestamp)
-- DROP FUNCTION vw_profile_grant_dq( text,  text , timestamp);

create or replace function vw_profile_grant_dq(alreadyauth_ text,  userid_ text, sessionid_ text , lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid( userid_,sessionid_) ;
    	perform isuserauthorized(userid_,'DELETE_VW_PROFILE_GRANT' );
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
alter function vw_profile_grant_dq(text, text, text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION vw_profile_grant_dq(text,  text, text, timestamp) TO GROUP golfscore;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
