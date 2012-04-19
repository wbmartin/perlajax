--post tables
--Custom types
drop type golfer_summary cascade;
create  type golfer_summary as (golfer_id int, golfer_name varchar, golf_score float, last_date timestamp, first_date timestamp);
drop type type_label_value cascade;
create  type type_label_value as (tp  varchar, lbl varchar, val varchar);
