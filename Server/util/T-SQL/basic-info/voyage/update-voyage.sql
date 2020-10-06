EXEC dbo.sp_Node_UpdateVoyage
  @VesselId = @vesselId,
    @VoyageNoIn = @voyageNoIn,
    @VoyageNoOut = @voyageNoOut ,
    @VoyageVessel = @voyageVessel,
    @OwnerId = @ownerId,
    @AgentId = @agentId,
    @EstimatedTimeArrival = @estimatedTimeArrival,
    @ActualTimeArrival = @actualTimeArrival,
    @EstimatedTimeDeparture = @estimatedTimeDeparture,
    @ActualTimeDeparture = @actualTimeDeparture,
    @voyageStatus = @voyageStatus,
    @OriginPort = @originPort,
    @PreviousPort = @previousPort,
    @NextPort = @nextPort,
    @VoyageId = @voyageId


