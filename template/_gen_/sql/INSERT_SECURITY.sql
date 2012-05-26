-- Security Grants
GRANT ALL ON TABLE golfer TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_GOLFER', now(), 'Allows users to select golfer'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_GOLFER', now(), 'Allows users to add records to golfer');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_GOLFER', now(), 'Allows users to update records in golfer');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_GOLFER', now(), 'Allows users to delete records from golfer');
select * from security_privilege where priv_name in ('SELECT_GOLFER','INSERT_GOLFER','UPDATE_GOLFER','DELETE_GOLFER');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE security_privilege TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_SECURITY_PRIVILEGE', now(), 'Allows users to select security_privilege'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_SECURITY_PRIVILEGE', now(), 'Allows users to add records to security_privilege');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_SECURITY_PRIVILEGE', now(), 'Allows users to update records in security_privilege');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_SECURITY_PRIVILEGE', now(), 'Allows users to delete records from security_privilege');
select * from security_privilege where priv_name in ('SELECT_SECURITY_PRIVILEGE','INSERT_SECURITY_PRIVILEGE','UPDATE_SECURITY_PRIVILEGE','DELETE_SECURITY_PRIVILEGE');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE vw_profile_grant TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_VW_PROFILE_GRANT', now(), 'Allows users to select vw_profile_grant'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_VW_PROFILE_GRANT', now(), 'Allows users to add records to vw_profile_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_VW_PROFILE_GRANT', now(), 'Allows users to update records in vw_profile_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_VW_PROFILE_GRANT', now(), 'Allows users to delete records from vw_profile_grant');
select * from security_privilege where priv_name in ('SELECT_VW_PROFILE_GRANT','INSERT_VW_PROFILE_GRANT','UPDATE_VW_PROFILE_GRANT','DELETE_VW_PROFILE_GRANT');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
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
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE security_user TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_SECURITY_USER', now(), 'Allows users to select security_user'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_SECURITY_USER', now(), 'Allows users to add records to security_user');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_SECURITY_USER', now(), 'Allows users to update records in security_user');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_SECURITY_USER', now(), 'Allows users to delete records from security_user');
select * from security_privilege where priv_name in ('SELECT_SECURITY_USER','INSERT_SECURITY_USER','UPDATE_SECURITY_USER','DELETE_SECURITY_USER');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE security_profile_grant TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_SECURITY_PROFILE_GRANT', now(), 'Allows users to select security_profile_grant'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_SECURITY_PROFILE_GRANT', now(), 'Allows users to add records to security_profile_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_SECURITY_PROFILE_GRANT', now(), 'Allows users to update records in security_profile_grant');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_SECURITY_PROFILE_GRANT', now(), 'Allows users to delete records from security_profile_grant');
select * from security_privilege where priv_name in ('SELECT_SECURITY_PROFILE_GRANT','INSERT_SECURITY_PROFILE_GRANT','UPDATE_SECURITY_PROFILE_GRANT','DELETE_SECURITY_PROFILE_GRANT');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE golf_score TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_GOLF_SCORE', now(), 'Allows users to select golf_score'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_GOLF_SCORE', now(), 'Allows users to add records to golf_score');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_GOLF_SCORE', now(), 'Allows users to update records in golf_score');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_GOLF_SCORE', now(), 'Allows users to delete records from golf_score');
select * from security_privilege where priv_name in ('SELECT_GOLF_SCORE','INSERT_GOLF_SCORE','UPDATE_GOLF_SCORE','DELETE_GOLF_SCORE');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
-- Security Grants
GRANT ALL ON TABLE security_profile TO GROUP golfscore;
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ( 'SELECT_SECURITY_PROFILE', now(), 'Allows users to select security_profile'); 
INSERT INTO security_privilege( priv_name, last_update, description)    VALUES ('INSERT_SECURITY_PROFILE', now(), 'Allows users to add records to security_profile');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ('UPDATE_SECURITY_PROFILE', now(), 'Allows users to update records in security_profile');
INSERT INTO security_privilege(  priv_name, last_update, description)    VALUES ( 'DELETE_SECURITY_PROFILE', now(), 'Allows users to delete records from security_profile');
select * from security_privilege where priv_name in ('SELECT_SECURITY_PROFILE','INSERT_SECURITY_PROFILE','UPDATE_SECURITY_PROFILE','DELETE_SECURITY_PROFILE');
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
INSERT INTO security_profile_grant( security_profile_id, security_privilege_id) VALUES ( 1, ?);
--=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
