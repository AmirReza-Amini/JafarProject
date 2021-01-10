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
	   SL.Address,
	   GCI.GarbageCollectionTariffId,
	   GCTD.Price AS Fee,v2.GrossTonage
FROM dbo.GarbageCollectionInvoices AS GCI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = GCI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = GCI.VoyageId
	INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = GCI.CurrencyId
	INNER JOIN dbo.ShippingLines AS SL ON v.AgentId = SL.ShippingLineId
	left JOIN dbo.GarbageCollectionTariffDetails AS GCTD ON GCTD.GarbageCollectionTariffDetailId = GCI.GarbageCollectionTariffId
    WHERE GT.GeneralType = 3 AND GCI.GarbageCollectionInvoiceId = @invoiceId