select V.VesselId,V.VesselName,v.GrossTonage,v.VesselType,GT.generalName as VesselTypeName,F.CountryName as FlagName,V.Flag ,V.Nationality,N.CountryName as NationalityName,V.NumOfBays,v.ActiveCraneQty,v.CallSign ,v.VesselLength 
        from Vessels as V
        inner join Countries as F on F.CountryId = v.Flag
        inner join Countries as N on N.CountryId = V.Nationality
		inner join generalTable as GT on GT.generalcode = V.VesselType
where GT.GeneralType = 1