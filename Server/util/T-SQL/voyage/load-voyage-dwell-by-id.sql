SELECT DATEDIFF(HOUR,ATA,ATD) AS Dwell,VE.VesselType,VE.GrossTonage,VE.Flag,ATA FROM dbo.Voyages AS V
INNER JOIN dbo.Vessels AS VE ON VE.VesselId = V.VesselId
WHERE VoyageId = @VoyageId