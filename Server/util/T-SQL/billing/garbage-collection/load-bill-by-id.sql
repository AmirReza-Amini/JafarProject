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
	   GT2.GeneralName AS VesselType,
	   GCTD.Price AS Fee,v2.GrossTonage,
	   V.ATA,
	   V.ATD
FROM dbo.GarbageCollectionInvoices AS GCI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = GCI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = GCI.VoyageId
	INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = GCI.CurrencyId
	INNER JOIN dbo.ShippingLines AS SL ON v.AgentId = SL.ShippingLineId
	left JOIN dbo.GarbageCollectionTariffDetails AS GCTD ON GCTD.GarbageCollectionTariffDetailId = GCI.GarbageCollectionTariffId
	INNER JOIN dbo.GeneralTable AS GT2 ON V2.VesselType = GT2.GeneralCode
    WHERE GT.GeneralType = 3 AND GT2.GeneralType=1 AND GCI.GarbageCollectionInvoiceId = @invoiceId