SELECT 
       VSTD.NormalHour ,
       VSTD.NormalPrice ,
       VSTD.ExtraPrice ,
       GT.GeneralName AS VesselType
	    FROM dbo.VesselStoppageTariffDetails AS VSTD
INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = VSTD.VesselType
WHERE GT.GeneralType = 1 AND VSTD.VesselStoppageTariffId = @id