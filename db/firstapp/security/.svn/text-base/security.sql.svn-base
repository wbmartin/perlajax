DROP TABLE public.user_confidential;
DROP TABLE public.security_profile_grant;
DROP TABLE public.security_user;
DROP TABLE public.security_profile;
DROP TABLE public.security_privilege;
DROP TABLE public.client;

CREATE TABLE public.client (
       client_id SERIAL NOT NULL
     , client_name TEXT
     , PRIMARY KEY (client_id)
);

CREATE TABLE public.security_privilege (
       client_id INTEGER NOT NULL
     , security_privilege_id SERIAL NOT NULL
     , priv_name TEXT
     , description TEXT
     , last_update TIMESTAMP(3)
     , PRIMARY KEY (client_id, security_privilege_id)
     , CONSTRAINT fk_securityprivilege_client FOREIGN KEY (client_id)
                  REFERENCES public.client (client_id)
);

CREATE TABLE public.security_profile (
       client_id INTEGER NOT NULL
     , security_profile_id SERIAL NOT NULL
     , profile_name TEXT
     , last_update TIMESTAMP(3)
     , PRIMARY KEY (client_id, security_profile_id)
     , CONSTRAINT fk_secuirtyprofile_client FOREIGN KEY (client_id)
                  REFERENCES public.client (client_id)
);

CREATE TABLE public.security_user (
       client_id INTEGER NOT NULL
     , user_id TEXT NOT NULL
     , last_update TIMESTAMP(3)
     , password_enc TEXT
     , security_profile_id INTEGER NOT NULL
     , session_id TEXT
     , session_expire_dt TIMESTAMP
     , active_yn CHAR(1)
     , last_name VARCHAR(25)
     , first_name VARCHAR(25)
     , middle_name VARCHAR(25)
     , office_address1 VARCHAR(25)
     , office_address2 VARCHAR(25)
     , office_city VARCHAR(25)
     , office_state CHAR(2)
     , office_zip CHAR(10)
     , title VARCHAR(25)
     , suffix VARCHAR(25)
     , office_phone CHAR(14)
     , fax CHAR(14)
     , office_cell CHAR(14)
     , comment TEXT
     , PRIMARY KEY (client_id, user_id)
     , CONSTRAINT fk_securityuser_client FOREIGN KEY (client_id)
                  REFERENCES public.client (client_id)
     , CONSTRAINT FK_security_user_2 FOREIGN KEY (client_id, security_profile_id)
                  REFERENCES public.security_profile (client_id, security_profile_id)
);

CREATE TABLE public.security_profile_grant (
       client_id INTEGER NOT NULL
     , security_privilege_id INTEGER NOT NULL
     , security_profile_id INTEGER NOT NULL
     , last_update TIMESTAMP(3) WITH TIME ZONE
     , PRIMARY KEY (client_id, security_privilege_id, security_profile_id)
     , CONSTRAINT FK_security_profile_grant_2 FOREIGN KEY (client_id, security_profile_id)
                  REFERENCES public.security_profile (client_id, security_profile_id)
     , CONSTRAINT fk_securityprofilegrant_securityprivilege FOREIGN KEY (client_id, security_privilege_id)
                  REFERENCES public.security_privilege (client_id, security_privilege_id)
);

CREATE TABLE public.user_confidential (
       client_id INTEGER NOT NULL
     , user_id TEXT NOT NULL
     , last_update TIMESTAMP(3)
     , home_address1 VARCHAR(25)
     , home_address2 VARCHAR(25)
     , home_city VARCHAR(25)
     , home_state CHAR(2)
     , home_zip CHAR(10)
     , home_phone CHAR(14)
     , personal_cell CHAR(14)
     , emergency_contact_name1 VARCHAR(25)
     , emergency_contact_phone1 CHAR(14)
     , emergency_contact_name2 VARCHAR(25)
     , emergency_contact_phone2 CHAR(14)
     , start_date DATE
     , termination_date DATE
     , exempt_yn CHAR(1)
     , annual_salary FLOAT4
     , hourly_bill_rate FLOAT4
     , hourly_pay_rate FLOAT4
     , comment TEXT
     , ssn_enc VARCHAR(25)
     , birth_date DATE
     , PRIMARY KEY (client_id, user_id)
     , CONSTRAINT FK_user_confidential_1 FOREIGN KEY (client_id, user_id)
                  REFERENCES public.security_user (client_id, user_id)
);

