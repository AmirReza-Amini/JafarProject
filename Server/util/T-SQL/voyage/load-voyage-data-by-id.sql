SELECT
    V.VoyageId , V.VoyageNoIn , V.VoyageNoOut ,
    V.VoyageVessel , V.ETA , V.ATA ,
    V.ETD , V.ATD , gt2.GeneralName as [Status] ,
    p3.PortName AS OriginPort , p2.PortName AS PreviousPort , p.PortName AS NextPort ,
    V2.VesselName , V2.GrossTonage , V2.VesselLength ,
    V2.NumOfBays , V2.ActiveCraneQty , V2.CallSign ,
    GT.GeneralName as VesselType, c.CountryName AS Flag, c2.CountryName AS Nationality,
	GCI.InvoiceNo,GCI.InvoiceDate,gci.PriceD,gci.PriceR
FROM dbo.Voyages AS V
    INNER JOIN dbo.Vessels AS V2 ON V2.VesselId = V.VesselId
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = v2.VesselType
    INNER JOIN dbo.GeneralTable AS GT2 ON GT2.GeneralCode = v.Status
    INNER JOIN dbo.Countries AS C ON C.CountryId = V2.Flag
    INNER JOIN dbo.Countries AS C2 ON C2.CountryId = V2.Nationality
    INNER JOIN dbo.Ports AS P ON P.PortId = V.NextPort
    INNER JOIN dbo.Ports AS P2 ON P2.PortId = V.PreviousPort
    INNER JOIN dbo.Ports AS P3 ON P3.PortId = V.OriginPort
	LEFT JOIN dbo.GarbageCollectionInvoices AS GCI ON GCI.VoyageId = V.VoyageId
WHERE GT.GeneralType = 1 AND GT2.GeneralType = 2 AND V.VoyageId = @voyageId