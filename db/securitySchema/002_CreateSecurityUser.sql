begin;
DROP TABLE  if exists SECURITY_USER cascade;
CREATE TABLE security_user
( security_user_id serial,
  user_id text NOT NULL,
  last_update timestamp(3) without time zone,
  updated_by text,
  password_enc text,
  security_profile_id integer NOT NULL,
  session_id text,
  session_expire_dt timestamp(3) without time zone,
  active_yn character(1),
  email_addr text,
	pwd_reset_cd text,
  CONSTRAINT security_user_pkey PRIMARY KEY (security_user_id),
  CONSTRAINT fk_security_user_2 FOREIGN KEY (security_profile_id)
      REFERENCES security_profile (security_profile_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
commit;
