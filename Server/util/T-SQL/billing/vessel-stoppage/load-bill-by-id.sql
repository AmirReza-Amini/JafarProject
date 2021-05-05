SELECT 
IC.InvoiceCoverId ,
       VSI.DwellHour AS DwellDate,
      VSI.PriceD AS vsPriceD,
       VSI.PriceR AS vsPriceR,
	   GCI.PriceD AS gcPriceD,
	   GCI.PriceR AS gcPriceR,
       IC.InvoiceCoverDate ,
       IC.InvoiceCoverNo ,
	   IC.SumInvoicePriceD,
	   Ic.SumInvoicePriceR,
       GT.GeneralName ,
       V.VoyageVessel ,
       C.FRate ,
       C.PRate,
       SL.ShippingLineName,
	   SL.Tel,
	   SL.Address,
        SL.EconomicCode,
	   SL.NationalCode,
       V.ATA,
       V.ATD,
       V2.VesselName,
	   GT2.GeneralName AS VesselType,
	  CASE WHEN VSI.DwellHour>VSTD.NormalHour then VSTD.ExtraPrice ELSE VSTD.NormalPrice END AS Fee,
	    v2.GrossTonage,
	   c2.CountryName AS Flag
FROM dbo.InvoiceCover AS IC 
	INNER JOIN dbo.VesselStopageInvoices AS VSI ON IC.InvoiceCoverId = VSI.InvoiceCover_Id
	INNER JOIN dbo.GarbageCollectionInvoices AS GCI ON IC.InvoiceCoverId = GCI.InvoiceCover_Id
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = IC.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = VSI.VoyageId
	INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = VSI.CurrencyId
	INNER JOIN dbo.ShippingLines AS SL ON v.AgentId = SL.ShippingLineId
	left JOIN dbo.VesselStoppageTariffDetails AS VSTD ON VSTD.VesselStoppageTariffDetailId = VSI.VesselStopageTariffId
	INNER JOIN dbo.GeneralTable AS GT2 ON V2.VesselType = GT2.GeneralCode
    INNER JOIN dbo.Countries AS C2 ON c2.CountryId = v2.Flag
    WHERE GT.GeneralType = 3 AND GT2.GeneralType=1 AND IC.InvoiceCoverId = @invoiceId