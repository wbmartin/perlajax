CREATE OR REPLACE FUNCTION cross_table_cache_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text)
  RETURNS SETOF type_label_value AS
$BODY$
  Declare
    
  Begin
    if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_CROSS_TABLE_CACHE' );
    end if;

    return query execute 'select ''golfer''::varchar as tp, name as lbl, golfer_id::varchar as val from golfer ';

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
