Create or replace View vw_profile_grant as
SELECT   sp.security_profile_id, sp.profile_name, spriv.security_privilege_id, spriv.priv_name, spg.last_update
   FROM  security_profile sp 
   LEFT JOIN security_profile_grant spg ON  sp.security_profile_id = spg.security_profile_id
   LEFT JOIN security_privilege spriv ON  spg.security_privilege_id = spriv.security_privilege_id;

ALTER TABLE vw_profile_grant OWNER TO postgres;
GRANT ALL ON TABLE vw_profile_grant TO postgres;
GRANT ALL ON TABLE vw_profile_grant TO golfscore;
GRANT ALL ON TABLE vw_profile_grant TO golfscore_grp;