-- StockLedgers Double-Entry Audit Ledger Schema Creation

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockLedgers')
BEGIN
    CREATE TABLE StockLedgers (
        id NVARCHAR(450) NOT NULL PRIMARY KEY,
        item_id NVARCHAR(450) NOT NULL,
        item_sku NVARCHAR(100) NULL,
        warehouse_id NVARCHAR(100) NULL,
        transaction_type NVARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        balance_before INT NOT NULL,
        balance_after INT NOT NULL,
        reservation_key NVARCHAR(100) NULL,
        reference_number NVARCHAR(100) NULL,
        notes NVARCHAR(MAX) NULL,
        created_by NVARCHAR(100) NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );

    CREATE INDEX IX_StockLedgers_ItemId ON StockLedgers (item_id);
    CREATE INDEX IX_StockLedgers_TransactionType ON StockLedgers (transaction_type);
    CREATE INDEX IX_StockLedgers_ReservationKey ON StockLedgers (reservation_key);
END;
