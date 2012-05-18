drop table golfer cascade;
CREATE TABLE golfer
(
  golfer_id serial NOT NULL,
  last_update timestamp(3) without time zone,
  "name" character varying(25),
  CONSTRAINT golfer_pkey PRIMARY KEY (golfer_id)
)
WITH (
  OIDS=FALSE
);
