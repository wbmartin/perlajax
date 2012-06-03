begin;
drop TABLE if exists security_privilege cascade;
CREATE TABLE security_privilege
(
  security_privilege_id int4 NOT NULL,
  priv_name text,
  description text,
  last_update timestamp(3) without time zone,
  updated_by text,
  CONSTRAINT security_privilege_pkey PRIMARY KEY (security_privilege_id)
)
WITH (
  OIDS=FALSE
);
commit;
