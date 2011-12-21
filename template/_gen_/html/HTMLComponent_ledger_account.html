\o ./log/CRUD_ledger_account.log
/*
-- Security Grants
GRANT ALL ON TABLE ledger_account TO GROUP simpledemo;
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'SELECT_LEDGER_ACCOUNT', now(), 'Allows users to select ledger_account'); 
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'INSERT_LEDGER_ACCOUNT', now(), 'Allows users to add records to ledger_account');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'UPDATE_LEDGER_ACCOUNT', now(), 'Allows users to update records in ledger_account');
INSERT INTO security_privilege(client_id,  priv_name, last_update, description)    VALUES (1, 'DELETE_LEDGER_ACCOUNT', now(), 'Allows users to delete records from ledger_account');
select * from security_privilege where priv_name in ('SELECT_LEDGER_ACCOUNT','INSERT_LEDGER_ACCOUNT','UPDATE_LEDGER_ACCOUNT','DELETE_LEDGER_ACCOUNT');
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
INSERT INTO security_profile_grant(client_id, security_profile_id, security_privilege_id) VALUES (1, 1, ?);
*/
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: ledger_account_sq(text, integer, text, text, text, text, integer, integer)

-- DROP FUNCTION ledger_account_sq(text, integer, text, text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION ledger_account_sq(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text, whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS SETOF ledger_account AS
$BODY$
  Declare
    additionalWhereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_LEDGER_ACCOUNT' );
    end if;
--client_id, ledger_account_id, last_update, name, account_type, ledger_commodity_id, parent_account_id, code, description

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

    return query execute 'select * from ledger_account where client_id =' || clientid_ || ' ' 
	|| additionalWhereClause || orderByclause || offsetStatement || limitStatement;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION ledger_account_sq(text, integer, text, text, text, text, integer, integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION ledger_account_sq(text, integer, text, text, text, text, integer, integer) TO GROUP simpledemo;

--select * from ledger_account_sq('ALREADY_AUTH', 1, 'test', 'test', '','',-1,-1);


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function: ledger_account_bypk(text, integer, text, text ,integer)

-- DROP FUNCTION ledger_account_pybk(text, integer, text, text,integer);

CREATE OR REPLACE FUNCTION ledger_account_bypk(alreadyAuth_ text, clientid_ integer, securityuserid_ text, sessionid_ text ,ledgerAccountId_ integer)
  RETURNS ledger_account AS
$BODY$
  Declare
    result ledger_account;
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid(clientid_, securityuserId_,sessionId_) ;
    	perform isUserAuthorized(clientid_, securityuserId_, 'SELECT_LEDGER_ACCOUNT' );
    end if;
--client_id, ledger_account_id, last_update, name, account_type, ledger_commodity_id, parent_account_id, code, description
   


     select * into result from ledger_account where client_id=clientId_ and ledger_account_id=ledgerAccountId_;
     return result;
  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION ledger_account_bypk(text, integer, text, text,integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION ledger_account_bypk(text, integer, text, text,integer) TO GROUP simpledemo;


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+



-- Function:  ledger_account_iq(text, integer, text ,character varying,character varying,integer,integer,character varying,character varying)

-- DROP FUNCTION ledger_account_iq( text, integer, text,character varying,character varying,integer,integer,character varying,character varying);

create or replace function ledger_account_iq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text,name_ character varying,accountType_ character varying,ledgerCommodityId_ integer,parentAccountId_ integer,code_ character varying,description_ character varying)
  returns ledger_account as
$body$
  declare
    newrow ledger_account;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_,'INSERT_LEDGER_ACCOUNT' );
    end if;


    insert into ledger_account(client_id ,last_update,name,account_type,ledger_commodity_id,parent_account_id,code,description) 
	values (clientid_ , now(),name_,accountType_,ledgerCommodityId_,parentAccountId_,code_,description_) 
	returning * into newrow;
      return newrow;
  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function ledger_account_iq(text, integer, text, text ,character varying,character varying,integer,integer,character varying,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION ledger_account_iq(text, integer, text, text ,character varying,character varying,integer,integer,character varying,character varying) TO GROUP simpledemo;



--select * from ledger_account_iq('ALREADY_AUTH', 1, 'test', 'test' , 'text', 'text' ,1 ,1, 'text', 'text' );


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+


-- Function:  ledger_account_uq(text, integer, text ,integer,timestamp,character varying,character varying,integer,integer,character varying,character varying)

-- DROP FUNCTION ledger_account_uq( text, integer, text ,integer,timestamp,character varying,character varying,integer,integer,character varying,character varying);


create or replace function ledger_account_uq(alreadyauth_ text, clientid_ integer, securityuserid_ text, sessionid_ text , ledgerAccountId_ integer, lastUpdate_ timestamp, name_ character varying, accountType_ character varying, ledgerCommodityId_ integer, parentAccountId_ integer, code_ character varying, description_ character varying)
  returns ledger_account as
$body$
  declare
    updatedrow ledger_account;
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, securityuserid_,sessionid_) ;
    	perform isuserauthorized(clientid_, securityuserid_, 'UPDATE_LEDGER_ACCOUNT' );
    end if;
	update ledger_account set last_update = now() ,  name= name_ ,  account_type= accountType_ ,  ledger_commodity_id= ledgerCommodityId_ ,  parent_account_id= parentAccountId_ ,  code= code_ ,  description= description_ 	where client_id=clientId_ and ledger_account_id=ledgerAccountId_   and   last_update = lastUpdate_
	returning * into updatedrow;

	if found then
	  return updatedrow;
	else 
	  raise exception 'Update Failed for LEDGER_ACCOUNT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function ledger_account_uq(text, integer, text, text ,integer,timestamp,character varying,character varying,integer,integer,character varying,character varying) owner to postgres;
GRANT EXECUTE ON FUNCTION ledger_account_uq(text, integer, text, text ,integer,timestamp,character varying,character varying,integer,integer,character varying,character varying) TO GROUP simpledemo;

--select * from ledger_account_uq('ALREADY_AUTH', 1, 'test', 'test' ,1 <last_update> <ledger_account_id>, 'text', 'text' ,1, 'text', 'text');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Function:  ledger_account_dq(text, integer, text ,integer, timestamp)

-- DROP FUNCTION ledger_account_dq( text, integer, text ,integer, timestamp);


create or replace function ledger_account_dq(alreadyauth_ text, clientid_ integer, userid_ text, sessionid_ text ,ledgerAccountId_ integer, lastUpdate_ timestamp  )
  returns boolean as
$body$
  declare
    
  begin
    if alreadyauth_ <>'ALREADY_AUTH' then	
    	perform issessionvalid(clientid_, userid_,sessionid_) ;
    	perform isuserauthorized(clientid_,userid_,'DELETE_LEDGER_ACCOUNT' );
    end if;
	delete from ledger_account where client_id=clientId_ and ledger_account_id=ledgerAccountId_  and last_update = lastUpdate_;

	if found then
	  return true;
	else 
	  raise exception 'Delete Failed for LEDGER_ACCOUNT- The record may have been changed or deleted before the attempt.';
	end if;

  end;
$body$
  language 'plpgsql' volatile
  cost 100;
alter function ledger_account_dq(text, integer, text, text,integer, timestamp) owner to postgres;
GRANT EXECUTE ON FUNCTION ledger_account_dq(text, integer, text, text,integer, timestamp) TO GROUP simpledemo;

--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
