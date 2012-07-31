begin;
CREATE OR REPLACE VIEW vw_user_grant AS 
 SELECT su.user_id, sp.profile_name, spriv.priv_name
   FROM security_user su
   LEFT JOIN security_profile sp ON su.security_profile_id = sp.security_profile_id
   LEFT JOIN security_profile_grant spg ON sp.security_profile_id = spg.security_profile_id
   LEFT JOIN security_privilege spriv ON spg.security_privilege_id = spriv.security_privilege_id
  where su.active_yn ='Y';
commit;
