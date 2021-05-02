SELECT
    V.VoyageId , V.VoyageNoIn , V.VoyageNoOut ,
    V.VoyageVessel , V.ETA , V.ATA ,
    V.ETD , V.ATD , gt2.GeneralName as [Status] ,
    p3.PortName AS OriginPort , p2.PortName AS PreviousPort , p.PortName AS NextPort ,
    V2.VesselName , V2.GrossTonage , V2.VesselLength ,
    V2.NumOfBays , V2.ActiveCraneQty , V2.CallSign ,
    GT.GeneralName as VesselType, c.CountryName AS Flag, c2.CountryName AS Nationality,
    GCI.GarbageCollectionInvoiceId as gcInvoiceId,
	GCI.InvoiceNo as gcInvoiceNo,GCI.InvoiceDate as gcInvoiceDate,gci.PriceD as gcPriceD,gci.PriceR as gcPriceR,
    VSI.VesselStopageInvoiceId as vsInvoiceId,
	VSI.InvoiceNo as vsInvoiceNo ,VSI.InvoiceDate as vsInvoiceDate,
     VSI.PriceD as vsPriceD,VSI.PriceR as vsPriceR,
	IC.InvoiceCoverDate , IC.SumInvoicePriceD,IC.SumInvoicePriceR, IC.InvoiceCoverNo,IC.InvoiceCoverId
FROM dbo.Voyages AS V
    INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = v2.VesselType
    INNER JOIN dbo.GeneralTable AS GT2 ON GT2.GeneralCode = v.Status
    Inner JOIN dbo.Countries AS C ON C.CountryId = V2.Flag
    LEft JOIN dbo.Countries AS C2 ON C2.CountryId = V2.Nationality
    LEft JOIN dbo.Ports AS P ON P.PortId = V.NextPort
    LEft JOIN dbo.Ports AS P2 ON P2.PortId = V.PreviousPort
    LEft JOIN dbo.Ports AS P3 ON P3.PortId = V.OriginPort
	LEFT JOIN dbo.InvoiceCover AS IC ON IC.VoyageId = V.VoyageId
	LEFT JOIN dbo.GarbageCollectionInvoices AS GCI ON Ic.InvoiceCoverId = GCI.InvoiceCover_Id
	LEFT JOIN dbo.VesselStopageInvoices AS VSI ON Ic.InvoiceCoverId = VSI.InvoiceCover_Id
WHERE GT.GeneralType = 1 AND GT2.GeneralType = 2 AND V.VoyageId = @voyageId