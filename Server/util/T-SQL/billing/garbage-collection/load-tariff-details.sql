SELECT  GCTD.GrossWeight , GCTD.Price , GCTD.GarbageCollectionTariffDetailId
FROM dbo.GarbageCollectionTariffDetails AS GCTD WHERE GCTD.GarbageCollectionTariffId = @id