CREATE OR REPLACE FUNCTION cross_table_cache_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text)
  RETURNS SETOF type_label_value AS
$BODY$
  Declare
  queryStr text;
    
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_CROSS_TABLE_CACHE' );
    end if;
    queryStr='select ''golfer''::varchar as tp, name as lbl, golfer_id::varchar as val from golfer   ';
    queryStr= queryStr || 'union select ''securityProfile''::varchar as tp, profile_name as lbl, security_profile_id::varchar as val from security_profile ';
    queryStr= queryStr || 'union select ''securityGrant''::varchar as tp, priv_name as lbl, ''''::varchar as val from vw_user_grant where user_id=''' || securityuserid_ ||'''';
    return query execute queryStr;	

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
