begin;
drop table security_profile cascade;
CREATE TABLE security_profile
(
  security_profile_id serial NOT NULL,
  profile_name text,
  last_update timestamp(3) without time zone,
  CONSTRAINT security_profile_pkey PRIMARY KEY (security_profile_id)
)
WITH (
  OIDS=FALSE
);
commit;
