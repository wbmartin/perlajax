

--select * from security_privilege;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)   
 VALUES (9, 'SELECT_GOLFER_HANDICAP', now(), 'Allows users to select golfer handicaps');

--select * from security_profile_grant 
insert into security_profile_grant (security_privilege_id, security_profile_id)values(9,1);  


create or replace function golfer_handicap_sq(alreadyAuth_ text, securityuserid_ text, sessionid_ text) returns setof golfer_summary as
$BODY$
  Declare
  result golfer_summary;
  golfers golfer;
  Begin
  if alreadyAuth_ <>'ALREADY_AUTH' then
    	perform isSessionValid( securityuserId_,sessionId_) ;
    	perform isUserAuthorized( securityuserId_, 'SELECT_GOLFER_HANDICAP' );
    end if;
  for golfers in select * from golfer order by name loop
    select golfers.golfer_id, golfers.name,  avg(golf_score) as avg_score, 
      max(last_update) as last_date, min(last_update) as first_date  into result from (
	select golf_score, last_update from golf_score
	where golfer_id =golfers.golfer_id order by last_update desc limit 10) as temp1 ; 
	 return next result;
  end loop;
  return;
  end; 
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100
  ROWS 1000;
  
