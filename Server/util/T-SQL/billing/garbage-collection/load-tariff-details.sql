SELECT  GCTD.GrossWeight , GCTD.Price 
FROM dbo.GarbageCollectionTariffDetails AS GCTD WHERE GCTD.GarbageCollectionTariffId = @id