CREATE TABLE public.payment_log (
       payment_log_id SERIAL NOT NULL
     , client_id INTEGER NOT NULL
     , customer_id INTEGER NOT NULL
     , last_update TIMESTAMP(3) WITHOUT TIME ZONE
     , effective_dt DATE
     , description TEXT
     , amount DOUBLE PRECISION
     , invoice_id INTEGER
     , customer_account_register_id INTEGER
     , PRIMARY KEY (payment_log_id, client_id, customer_id)
     , CONSTRAINT FK_payment_log_1 FOREIGN KEY (customer_id, client_id)
                  REFERENCES public.customer (customer_id, client_id)
     , CONSTRAINT FK_payment_log_3 FOREIGN KEY (invoice_id, client_id, customer_id)
                  REFERENCES public.invoice (invoice_id, client_id, customer_id)
     , CONSTRAINT FK_paymentlog_customeraccountregister FOREIGN KEY (customer_account_register_id, client_id, customer_id)
                  REFERENCES public.customer_account_register (customer_account_register_id, client_id, customer_id)
);

