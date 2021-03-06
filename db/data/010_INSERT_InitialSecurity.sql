insert into security_profile(security_profile_id, profile_name, last_update) 
	values(1,'default',now());
insert into security_user(user_id,last_update, password_enc, security_profile_id, active_yn, email_addr) 
	values('golfscore',now(), md5('golfscore'),1,'Y','w.brandon.martin@gmail.com');

INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (1, 'SELECT_GOLFER', now(), 'Allows users to select golfer'); 
INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (2,'INSERT_GOLFER', now(), 'Allows users to add records to golfer');
INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (3,'UPDATE_GOLFER', now(), 'Allows users to update records in golfer');
INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (4, 'DELETE_GOLFER', now(), 'Allows users to delete records from golfer');

INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (5, 'SELECT_GOLF_SCORE', now(), 'Allows users to select golf_score'); 
INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (6,'INSERT_GOLF_SCORE', now(), 'Allows users to add records to golf_score');
INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (7,'UPDATE_GOLF_SCORE', now(), 'Allows users to update records in golf_score');
INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (8, 'DELETE_GOLF_SCORE', now(), 'Allows users to delete records from golf_score');

	
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)   
	 VALUES (9, 'SELECT_GOLFER_HANDICAP', now(), 'Allows users to select golfer handicaps');

INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (10, 'SELECT_CROSS_TABLE_CACHE', now(), 'Required for all users to populate options'); 

INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (11, 'SELECT_SECURITY_PROFILE_GRANT', now(), 'Allows users to view permissions assigned to a profile '); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)   
	VALUES (12,'INSERT_SECURITY_PROFILE_GRANT', now(), 'Allows users to add records to security_profile_grant');
/*	wbmartin2012-08-22|grants are inserted and deleted, not updated.
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)   
	VALUES (13,'UPDATE_SECURITY_PROFILE_GRANT', now(), 'Allows users to update records in security_profile_grant');
	*/
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)   
	VALUES (14, 'DELETE_SECURITY_PROFILE_GRANT', now(), 'Allows users to delete records from security_profile_grant');

INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (15 ,'SELECT_SECURITY_PROFILE', now(), 'Allows users to select security_profile'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (16,'INSERT_SECURITY_PROFILE', now(), 'Allows users to add records to security_profile');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (17,'UPDATE_SECURITY_PROFILE', now(), 'Allows users to update records in security_profile');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (18 ,'DELETE_SECURITY_PROFILE', now(), 'Allows users to delete records from security_profile');

INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (19 ,'SELECT_SECURITY_USER', now(), 'Allows users to select security_user'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (20,'INSERT_SECURITY_USER', now(), 'Allows users to add records to security_user');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (21,'UPDATE_SECURITY_USER', now(), 'Allows users to update records in security_user');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (22 ,'DELETE_SECURITY_USER', now(), 'Allows users to delete records from security_user');
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (23 ,'SELECT_SECURITY_PRIVILEGE', now(), 'Allows users to select security_privilege'); 
/* wbmartin 2012-08-22|UI doesn't use privs, uses grants instead.
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (24,'INSERT_SECURITY_PRIVILEGE', now(), 'Allows users to add records to security_privilege');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (25,'UPDATE_SECURITY_PRIVILEGE', now(), 'Allows users to update records in security_privilege');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (26 ,'DELETE_SECURITY_PRIVILEGE', now(), 'Allows users to delete records from security_privilege');
	*/
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (27 ,'CHANGE_OTHERS_PWD', now(), 'Admin-Allows users to change other users passwords');


INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES ( 28,'SELECT_SUPPORT_REQUEST', now(), 'Allows users to select support_request'); 
INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (29,'INSERT_SUPPORT_REQUEST', now(), 'Allows users to add records to support_request');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES (30,'UPDATE_SUPPORT_REQUEST', now(), 'Allows users to update records in support_request');
INSERT INTO security_privilege( security_privilege_id,  priv_name, last_update, description)    
	VALUES ( 31,'DELETE_SUPPORT_REQUEST', now(), 'Allows users to delete records from support_request');







---------------------------------
delete from security_profile_grant where security_profile_id =1;
insert into security_profile_grant (security_profile_id, security_privilege_id, last_update, updated_by)
select 1,security_privilege_id,now(),'sys' from security_privilege;

