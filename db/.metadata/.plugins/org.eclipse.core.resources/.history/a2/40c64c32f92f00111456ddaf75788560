DROP TABLE public.golf_score;
DROP TABLE public.golfer;

CREATE TABLE public.golfer (
       golfer_id SERIAL NOT NULL
     , last_update TIMESTAMP(3) WITHOUT TIME ZONE
     , name VARCHAR(25)
     , PRIMARY KEY (golfer_id)
);

CREATE TABLE public.golf_score (
       golf_score_id CHAR(10) NOT NULL
     , last_update TIMESTAMP(3) WITHOUT TIME ZONE
     , golf_score INT4
     , golfer_id INTEGER
     , PRIMARY KEY (golf_score_id)
     , CONSTRAINT FK_golf_score_1 FOREIGN KEY (golfer_id)
                  REFERENCES public.golfer (golfer_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

