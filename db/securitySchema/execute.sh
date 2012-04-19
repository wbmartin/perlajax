#!/bin/bash
psql -Upostgres -dfirstapp -h localhost -f executeSecurity.sql &> log/test.log

