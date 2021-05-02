 SELECT  VI.VoyageId AS voyageId ,
                VI.VoyageNoIn AS incomingVoyageNo ,
                VI.VoyageNoOut AS outgoingVoyageNo ,
                VI.ETA AS estimatedTimeArrival ,
                VI.ATA AS actualTimeArrival ,
                VI.ETD AS estimatedTimeDeparture ,
                VI.ATD AS actualTimeDeparture ,
                AG.ShippingLineId AS agentId ,
                AG.ShippingLineName AS agentName ,
                OW.ShippingLineId AS ownerId ,
                OW.ShippingLineName AS ownerName ,
                VS.VesselId AS vesselId ,
                VS.VesselName AS vesselName ,
                PP.PortId AS previousPortId ,
                PP.PortName AS previousPortName ,
                NP.PortId AS nextPortId ,
                NP.PortName AS nextPortName ,
                OP.PortId AS originPortId ,
                OP.PortName AS originPortName ,
                GT.GeneralCode AS voyageStatusCode ,
                GT.GeneralName AS voyageStatus
        FROM    dbo.Voyages AS VI
                INNER JOIN dbo.ShippingLines AS AG ON AG.ShippingLineId = VI.AgentId
                INNER JOIN dbo.ShippingLines AS OW ON OW.ShippingLineId = VI.OwnerId
                INNER JOIN dbo.Vessels AS VS ON VS.VesselId = VI.VesselId
                Left JOIN dbo.Ports AS PP ON PP.PortId = VI.PreviousPort
                Left JOIN dbo.Ports AS NP ON NP.PortId = VI.NextPort
                Left JOIN dbo.Ports AS OP ON OP.PortId = VI.OriginPort
                INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = VI.Status
                                                     AND GT.GeneralType = 2;