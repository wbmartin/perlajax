#!/bin/bash
PGUNAME=concordc_golfscoredev
PGDB=concordc_golfscoredev
PGHOST=localhost

PGUNAME=concordc_golfscoreuat
PGDB=concordc_golfscoreuat
PGHOST=www.martinanalytics.com


#For first installs, need to create language plpgsql

#psql -U$PGUNAME -d$PGDB -h $PGHOST -f removeAll.sql &> _removeAll.log
psql -U$PGUNAME -d$PGDB -h $PGHOST -f 000_AppInit.sql &> _AppInit.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeInfrastructure.sql &> _infrastructure.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeSecurity.sql &> _securitySchema.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeTables.sql &> _tables.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeViews.sql &> _views.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeProcs.sql &> _procs.log
#psql -U$PGUNAME -d$PGDB -h $PGHOST -f executeData.sql &> _data.log

