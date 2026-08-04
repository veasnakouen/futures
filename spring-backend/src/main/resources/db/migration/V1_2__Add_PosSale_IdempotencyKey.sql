-- Add Idempotency Key Column to pos_sales table

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'pos_sales')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('pos_sales') AND name = 'idempotency_key')
    BEGIN
        ALTER TABLE pos_sales ADD idempotency_key NVARCHAR(255) NULL;
        ALTER TABLE pos_sales ADD CONSTRAINT UQ_pos_sales_idempotency_key UNIQUE (idempotency_key);
    END;
END;
