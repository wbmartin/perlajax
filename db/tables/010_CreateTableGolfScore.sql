drop table golf_score cascade;
CREATE TABLE golf_score
(
  golf_score_id serial NOT NULL,
  last_update timestamp(3) without time zone,
  updated_by text,
  golf_score integer,
  golfer_id integer,
  game_dt date,
  CONSTRAINT golf_score_pkey PRIMARY KEY (golf_score_id),
  CONSTRAINT fk_golf_score_1 FOREIGN KEY (golfer_id)
      REFERENCES golfer (golfer_id) MATCH SIMPLE
      ON UPDATE RESTRICT ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);
