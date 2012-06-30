begin;
drop table if exists security_profile_grant cascade;
CREATE TABLE security_profile_grant
(
  security_profile_grant_id serial NOT NULL,
  security_privilege_id integer NOT NULL,
  security_profile_id integer NOT NULL,
  last_update timestamp(3) without time zone,
  updated_by text,
  CONSTRAINT security_profile_grant_pkey PRIMARY KEY (security_profile_grant_id),
  CONSTRAINT fk_security_profile_grant_2 FOREIGN KEY (security_profile_id)
      REFERENCES security_profile (security_profile_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_securityprofilegrant_securityprivilege FOREIGN KEY (security_privilege_id)
      REFERENCES security_privilege (security_privilege_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
commit;
