SELECT VSTD.* FROM dbo.VesselStoppageTariffs AS VST
INNER JOIN dbo.VesselStoppageTariffDetails AS VSTD ON VSTD.VesselStoppageTariffId = VST.VesselStoppageTariffId
WHERE VST.EffectiveDate > GETDATE() AND VSTD.VesselType = @vesselType