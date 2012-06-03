#!/bin/bash
PGUNAME=concordc_golfscoredev
PGDB=concordc_golfscoredev
PGHOST=localhost

#For first installs, need to create language plpgsql


psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeSecurity.sql &> _securitySchema.log
psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeTables.sql &> _tables.log
psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeViews.sql &> _views.log
psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeProcs.sql &> _procs.log
psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeData.sql &> _data.log

