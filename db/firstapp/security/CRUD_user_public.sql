\o ./log/CRUD_user_public.log﻿
/*
-- Security Grants
GRANT ALL ON TABLE user_public TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_USER_PUBLIC', now(), 'Allows users to select user_public'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_USER_PUBLIC', now(), 'Allows users to add records to user_public');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_USER_PUBLIC', now(), 'Allows users to update records in user_public');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_USER_PUBLIC', now(), 'Allows users to delete records from user_public');
select * from security_privilege where priv_name in ('SELECT_USER_PUBLIC','INSERT_USER_PUBLIC','UPDATE_USER_PUBLIC','DELETE_USER_PUBLIC');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, 26);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, 27);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, 28);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, 29);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: user_public_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION user_public_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION user_public_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF user_public AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_USER_PUBLIC' );
    end if;
--client_id, user_id, last_update, last_name, first_name, middle_name, office_address1, office_address2, office_city, office_state, office_zip, title, suffix, office_phone, fax, office_cell, comment

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

    return query execute 'select * from user_public where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION user_public_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION user_public_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from user_public_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: user_public_bypk(text, integer, text, text ,text)

-- DROP FUNCTION user_public_pybk(text, integer, text, text,text);

CREATE OR REPLACE FUNCTION user_public_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,userId_ text)
  RETURNS user_public AS
$BODY$
  Declare
    result user_public;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_USER_PUBLIC' );
    end if;
--client_id, user_id, last_update, last_name, first_name, middle_name, office_address1, office_address2, office_city, office_state, office_zip, title, suffix, office_phone, fax, office_cell, comment
   


     select * into result from user_public where client_id=clientId_ and user_id=userId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION user_public_bypk(text, integer, text, text,text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION user_public_bypk(text, integer, text, text,text) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  user_public_iq(text, integer, text ,text,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text)

-- DROP FUNCTION user_public_iq( text, integer, text,text,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text);

create or replace function user_public_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,userId_ text,lastName_ character varying,firstName_ character varying,middleName_ character varying,officeAddress1_ character varying,officeAddress2_ character varying,officeCity_ character varying,officeState_ character,officeZip_ character,title_ character varying,suffix_ character varying,officePhone_ character,fax_ character,officeCell_ character,comment_ text)
  returns user_public as
$body$
  declare
    newrow user_public;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_USER_PUBLIC' );
    end if;


    insert into user_public(client_id ,user_id,last_update,last_name,first_name,middle_name,office_address1,office_address2,office_city,office_state,office_zip,title,suffix,office_phone,fax,office_cell,comment) 
	values (clientid_ ,userId_, now(),lastName_,firstName_,middleName_,officeAddress1_,officeAddress2_,officeCity_,officeState_,officeZip_,title_,suffix_,officePhone_,fax_,officeCell_,comment_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function user_public_iq(text, integer, text, text ,text,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text) owner to postgres;
GRANT EXECUTE ON FUNCTION user_public_iq(text, integer, text, text ,text,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text) TO GROUP simpledemo;



--select * from user_public_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  user_public_uq(text, integer, text ,text,timestamp,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text)

-- DROP FUNCTION user_public_uq( text, integer, text ,text,timestamp,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text);


create or replace function user_public_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , userId_ text, lastUpdate_ timestamp, lastName_ character varying, firstName_ character varying, middleName_ character varying, officeAddress1_ character varying, officeAddress2_ character varying, officeCity_ character varying, officeState_ character, officeZip_ character, title_ character varying, suffix_ character varying, officePhone_ character, fax_ character, officeCell_ character, comment_ text)
  returns user_public as
$body$
  declare
    updatedrow user_public;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_USER_PUBLIC' );
    end if;
	update user_public set last_update = now() ,  last_name= lastName_ ,  first_name= firstName_ ,  middle_name= middleName_ ,  office_address1= officeAddress1_ ,  office_address2= officeAddress2_ ,  office_city= officeCity_ ,  office_state= officeState_ ,  office_zip= officeZip_ ,  title= title_ ,  suffix= suffix_ ,  office_phone= officePhone_ ,  fax= fax_ ,  office_cell= officeCell_ ,  comment= comment_ 	where client_id=clientId_ and user_id=userId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for USER_PUBLIC- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function user_public_uq(text, integer, text, text ,text,timestamp,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text) owner to postgres;
GRANT EXECUTE ON FUNCTION user_public_uq(text, integer, text, text ,text,timestamp,character varying,character varying,character varying,character varying,character varying,character varying,character,character,character varying,character varying,character,character,character,text) TO GROUP simpledemo;

--select * from user_public_uq('ALREADY_AUTH', 1, 'test', 'test' <last_update>, 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  user_public_dq(text, integer, text ,text, timestamp)

-- DROP FUNCTION user_public_dq( text, integer, text ,text, timestamp);


create or replace function user_public_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,userId_ text, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_USER_PUBLIC' );
    end if;
	delete from user_public where client_id=clientId_ and user_id=userId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for USER_PUBLIC- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function user_public_dq(text, integer, text, text,text, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION user_public_dq(text, integer, text, text,text, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
