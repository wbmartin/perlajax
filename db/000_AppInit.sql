begin;

CREATE OR REPLACE FUNCTION buildSQLClauses( whereClause_ text, orderByClause_ text, rowLimit_ integer, rowOffset_ integer)
  RETURNS text AS
$BODY$
  Declare
    whereClause text;
    orderByClause text;
    offsetStatement text;
    limitStatement text;
    aggregateClause text;
  Begin
    whereClause ='';
    orderByClause='';
    offsetStatement ='';
    limitStatement ='';
    if rowOffset_ >0 then
	offsetStatement =' offset ' || rowOffset_ ;
    end if;
    if rowLimit_ >0 then
	limitStatement =' limit '||rowLimit_;
    end if;
    if whereClause_ <>'' then
	whereClause = trim(leading whereClause_);
	whereClause = regexp_replace(whereClause, '^(where|WHERE)','');
        whereClause = ' where ' || whereClause;
    end if;
    if orderByClause_ <> '' then
	orderByClause = orderByClause_;
    end if;
	aggregateClause = whereClause || orderByclause || offsetStatement || limitStatement;
	aggregateClause = regexp_replace(aggregateClause, ';|/\*|\*/|dblink|pg_|\-\-|user|\&|\\g', '', 'g');
	--; /* */ dblink pg_ -- user & \g
    return aggregateClause;

  End;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
  commit;
