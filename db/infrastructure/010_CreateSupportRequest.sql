begin;
drop table if exists support_request cascade;
CREATE TABLE support_request
(
  support_request_id serial NOT NULL,
  summary text,
	detailed_description text,
	log_details text,
	solution_description text,
  last_update timestamp(3) without time zone,
  updated_by text,
  CONSTRAINT support_request_pkey PRIMARY KEY (support_request_id)
)
WITH (
  OIDS=FALSE
);
commit;
