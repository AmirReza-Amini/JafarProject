SELECT 
GCI.GarbageCollectionInvoiceId ,
       GCI.DwellDate ,
       GCI.PriceD ,
       GCI.PriceR ,
       GCI.InvoiceDate ,
       GCI.InvoiceNo ,
       GT.GeneralName ,
       V.VoyageVessel ,
       C.Rate ,
       SL.ShippingLineName,
	   SL.Tel,
	   SL.Address
FROM dbo.GarbageCollectionInvoices AS GCI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = GCI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = GCI.VoyageId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = GCI.CurrencyId
	INNER JOIN dbo.ShippingLines AS SL ON v.AgentId = SL.ShippingLineId
    WHERE GT.GeneralType = 3
and GCI.InvoiceNo = @invoiceNo