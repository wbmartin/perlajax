
insert into security_profile(security_profile_id, profile_name, last_update) values(1,'default',now());
insert into security_user(user_id,last_update, password_enc, security_profile_id, active_yn) 
values('username',now(), md5('password'),1,'Y');
-- Security Grants
--GRANT ALL ON TABLE golfer TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_GOLFER', now(), 'Allows users to select golfer'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_GOLFER', now(), 'Allows users to add records to golfer');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_GOLFER', now(), 'Allows users to update records in golfer');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_GOLFER', now(), 'Allows users to delete records from golfer');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE security_privilege TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_SECURITY_PRIVILEGE', now(), 'Allows users to select security_privilege'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_SECURITY_PRIVILEGE', now(), 'Allows users to add records to security_privilege');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_SECURITY_PRIVILEGE', now(), 'Allows users to update records in security_privilege');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_SECURITY_PRIVILEGE', now(), 'Allows users to delete records from security_privilege');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE vw_profile_grant TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_VW_PROFILE_GRANT', now(), 'Allows users to select vw_profile_grant'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_VW_PROFILE_GRANT', now(), 'Allows users to add records to vw_profile_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_VW_PROFILE_GRANT', now(), 'Allows users to update records in vw_profile_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_VW_PROFILE_GRANT', now(), 'Allows users to delete records from vw_profile_grant');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE vw_user_grant TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_VW_USER_GRANT', now(), 'Allows users to select vw_user_grant'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_VW_USER_GRANT', now(), 'Allows users to add records to vw_user_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_VW_USER_GRANT', now(), 'Allows users to update records in vw_user_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_VW_USER_GRANT', now(), 'Allows users to delete records from vw_user_grant');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE security_user TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_SECURITY_USER', now(), 'Allows users to select security_user'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_SECURITY_USER', now(), 'Allows users to add records to security_user');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_SECURITY_USER', now(), 'Allows users to update records in security_user');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_SECURITY_USER', now(), 'Allows users to delete records from security_user');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE security_profile_grant TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_SECURITY_PROFILE_GRANT', now(), 'Allows users to select security_profile_grant'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_SECURITY_PROFILE_GRANT', now(), 'Allows users to add records to security_profile_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_SECURITY_PROFILE_GRANT', now(), 'Allows users to update records in security_profile_grant');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_SECURITY_PROFILE_GRANT', now(), 'Allows users to delete records from security_profile_grant');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE security_profile TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_SECURITY_PROFILE', now(), 'Allows users to select security_profile'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_SECURITY_PROFILE', now(), 'Allows users to add records to security_profile');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_SECURITY_PROFILE', now(), 'Allows users to update records in security_profile');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_SECURITY_PROFILE', now(), 'Allows users to delete records from security_profile');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE support_request TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_SUPPORT_REQUEST', now(), 'Allows users to select support_request'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_SUPPORT_REQUEST', now(), 'Allows users to add records to support_request');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_SUPPORT_REQUEST', now(), 'Allows users to update records in support_request');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_SUPPORT_REQUEST', now(), 'Allows users to delete records from support_request');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
--GRANT ALL ON TABLE golf_score TO GROUP golfscore;
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( ,'SELECT_GOLF_SCORE', now(), 'Allows users to select golf_score'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (,'INSERT_GOLF_SCORE', now(), 'Allows users to add records to golf_score');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (,'UPDATE_GOLF_SCORE', now(), 'Allows users to update records in golf_score');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( ,'DELETE_GOLF_SCORE', now(), 'Allows users to delete records from golf_score');


--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

delete from security_profile_grant where security_profile_id =1;
insert into security_profile_grant (security_profile_id, security_privilege_id, last_update, updated_by)
select 1,security_privilege_id,now(),'sys' from security_privilege;