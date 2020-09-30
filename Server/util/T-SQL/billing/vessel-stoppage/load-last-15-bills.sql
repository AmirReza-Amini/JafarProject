
SELECT TOP 15 VSI.VesselStopageInvoiceId,VSI.DwellHour, VSI.PriceD, VSI.PriceR, VSI.InvoiceNo,
    VSI.InvoiceDate, V.VoyageVessel, GT.GeneralName AS Status, C.Rate, VSI.UserId
FROM dbo.VesselStopageInvoices AS VSI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = VSI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = VSI.VoyageId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = VSI.CurrencyId
ORDER BY VSI.VesselStopageInvoiceId DESC