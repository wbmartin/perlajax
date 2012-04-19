insert into security_profile(security_profile_id, profile_name, last_update) values(1,'default',now());
insert into security_user(user_id,last_update, password_enc, security_profile_id, active_yn) 
values('golfscore',now(), md5('golfscore'),1,'Y');

INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (1, 'SELECT_GOLFER', now(), 'Allows users to select golfer'); 
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 1);

INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (2,'INSERT_GOLFER', now(), 'Allows users to add records to golfer');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 2);

INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (3,'UPDATE_GOLFER', now(), 'Allows users to update records in golfer');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 3);

INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (4, 'DELETE_GOLFER', now(), 'Allows users to delete records from golfer');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 4);



INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (5, 'SELECT_GOLF_SCORE', now(), 'Allows users to select golf_score'); 
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 5);

INSERT INTO security_privilege(security_privilege_id, priv_name, last_update, description)    
	VALUES (6,'INSERT_GOLF_SCORE', now(), 'Allows users to add records to golf_score');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 6);

INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (7,'UPDATE_GOLF_SCORE', now(), 'Allows users to update records in golf_score');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 7);

INSERT INTO security_privilege(security_privilege_id,  priv_name, last_update, description)    
	VALUES (8, 'DELETE_GOLF_SCORE', now(), 'Allows users to delete records from golf_score');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 8);


INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)   
	 VALUES (9, 'SELECT_GOLFER_HANDICAP', now(), 'Allows users to select golfer handicaps');
insert into security_profile_grant (security_privilege_id, security_profile_id)
	values(9,1);


INSERT INTO security_privilege( security_privilege_id, priv_name, last_update, description)    
	VALUES (10, 'SELECT_CROSS_TABLE_CACHE', now(), 'Required for all users to populate options'); 
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) 
	VALUES ( 1, 10);





