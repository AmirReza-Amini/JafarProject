INSERT dbo.VesselStopageInvoices
VALUES  ( @tariffId , -- VesselStopageTariffDetailId - bigint
          @voyageId , -- VoyageId - bigint
          @currencyId , -- CurrencyId - bigint
          @dwell , -- DwellHour - int
          @priceD , -- PriceD - money
          @priceR , -- PriceR - money
          GETDATE() , -- InvoiceDate - datetime
          @invoiceNo , -- InvoiceNo - nvarchar(12)
          0 , -- Status - tinyint
          @userId  -- UserId - bigint
        )