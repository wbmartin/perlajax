\set ECHO all
\i securitySchema/000_preSecuritySchema.sql
\i securitySchema/001_CreateSecurityProfile.sql
\i securitySchema/002_CreateSecurityUser.sql
\i securitySchema/003_CreateSecurityPrivilege.sql
\i securitySchema/004_CreateSecurityProfileGrant.sql

\i securitySchema/005_CreateVw_ProfileGrant.sql
\i securitySchema/006_CreateVw_UserGrant.sql

\i securitySchema/010_CreateSP_InitSession.sql
\i securitySchema/011_CreateSP_IsSessionValid.sql
\i securitySchema/012_CreateSP_IsUserAuthorized.sql

