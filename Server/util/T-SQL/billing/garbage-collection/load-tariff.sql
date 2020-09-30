SELECT TOP 1 GCTD.* FROM dbo.GarbageCollectionTariffs AS GCT
INNER JOIN dbo.GarbageCollectionTariffDetails AS GCTD ON GCTD.GarbageCollectionTariffId = GCT.GarbageCollectionTariffId
WHERE EffectiveDate > GETDATE() AND GCTD.GrossWeight > @tonage