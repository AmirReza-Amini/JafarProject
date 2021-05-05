SELECT TOP 1 * FROM dbo.Currencies
WHERE date >=CAST(@date as Date)
ORDER BY Date
