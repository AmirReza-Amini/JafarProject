SELECT 
VSI.VesselStopageInvoiceId ,
       VSI.DwellHour AS DwellDate,
       VSI.PriceD ,
       VSI.PriceR ,
       VSI.InvoiceDate ,
       VSI.InvoiceNo ,
       GT.GeneralName ,
       V.VoyageVessel ,
       C.Rate ,
       SL.ShippingLineName,
	   SL.Tel,
	   SL.Address,
       V.ATA,
       V.ATD,
	   GT2.GeneralName AS VesselType,
	  CASE WHEN VSI.DwellHour>VSTD.NormalHour then VSTD.ExtraPrice ELSE VSTD.NormalPrice END AS Fee,
	   v2.GrossTonage
FROM dbo.VesselStopageInvoices AS VSI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = VSI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = VSI.VoyageId
	INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = VSI.CurrencyId
	INNER JOIN dbo.ShippingLines AS SL ON v.AgentId = SL.ShippingLineId
	left JOIN dbo.VesselStoppageTariffDetails AS VSTD ON VSTD.VesselStoppageTariffDetailId = VSI.VesselStopageTariffId
	INNER JOIN dbo.GeneralTable AS GT2 ON V2.VesselType = GT2.GeneralCode

    WHERE GT.GeneralType = 3 AND GT2.GeneralType=1 AND VSI.VesselStopageInvoiceId = @invoiceId