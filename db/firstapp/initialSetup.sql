insert into security_profile(security_profile_id, profile_name, last_update) values(1,'default',now());
insert into security_user(user_id,last_update, password_enc, security_profile_id, active_yn) 
values('golfscore',now(), md5('golfscore'),1,'Y');