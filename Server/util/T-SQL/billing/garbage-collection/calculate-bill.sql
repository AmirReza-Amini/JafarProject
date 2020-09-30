INSERT dbo.GarbageCollectionInvoices
VALUES  ( @tariffId , -- GarbageCollectionTariffDetailId - bigint
          @dwell , -- DwellHour - int
          @priceD , -- PriceD - money
          @priceR , -- PriceR - money
          @voyageId , -- VoyageId - bigint
          @currencyId , -- CurrencyId - bigint
          GETDATE() , -- InvoiceDate - datetime
          @invoiceNo , -- InvoiceNo - nvarchar(12)
          @userId , -- UserId - bigint
          0  -- Status - tinyint
        )