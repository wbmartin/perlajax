insert into security_profile(security_profile_id, profile_name, last_update) values(1,'default',now());
insert into security_user(user_id,last_update, password_enc, security_profile_id, active_yn) 
values('golfscore',now(), md5('golfscore'),1,'Y');


CREATE OR REPLACE VIEW vw_profile_grant AS 
 SELECT  sp.security_profile_id, sp.profile_name, spriv.security_privilege_id, spriv.priv_name, spg.last_update
   FROM security_profile sp
   LEFT JOIN security_profile_grant spg ON  sp.security_profile_id = spg.security_profile_id
   LEFT JOIN security_privilege spriv ON  spg.security_privilege_id = spriv.security_privilege_id;

CREATE OR REPLACE VIEW vw_user_grant AS 
 SELECT su.user_id,  sp.profile_name, spriv.priv_name
   FROM security_user su
   LEFT JOIN security_profile sp ON  su.security_profile_id = sp.security_profile_id
   LEFT JOIN security_profile_grant spg ON  sp.security_profile_id = spg.security_profile_id
   LEFT JOIN security_privilege spriv ON  spg.security_privilege_id = spriv.security_privilege_id;
   