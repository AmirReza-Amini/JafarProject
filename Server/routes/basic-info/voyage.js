const express = require("express");
const router = express.Router();
const { SendResponse, ToPersian, ConvertProperties, FormatNumber } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.get('/get-last-voyages', async (req, res) => {
    let result = await db.query(queries.VOYAGE.getLast10Voyages)
    SendResponse(req, res, result)
})

router.route('/:id?')
    .get(async (req, res) => {

        console.log("req.params.id", req.params.id)
        if (req.params.id) {
            let result = (await db.query(queries.VOYAGE.loadVoyageDataById, { voyageId: req.params.id }))[0]
            ConvertProperties(result, ['ETA', 'ATA', 'ETD', 'ATD', 'InvoiceDate'], ToPersian);
            ConvertProperties(result, ['PriceR', 'PriceD','GrossTonage','VesselLength'], FormatNumber);
            console.log("result", result)
            return SendResponse(req, res, result);
        }
        let result = await db.query(queries.VOYAGE.getVoyageList)
        
        SendResponse(req, res, result)
    })
    .post(async (req, res) => {
        try {
            const data = req.body
            console.log('befor', data)
            let query = await db.query(queries.VOYAGE.insertVoyage, {
                vesselId: data.vesselId,
                voyageNoIn: data.incomingVoyageNo,
                voyageNoOut: data.outgoingVoyageNo,
                voyageVessel: data.voyageVessel,
                ownerId: data.ownerId,
                agentId: data.agentId,
                estimatedTimeArrival: data.estimatedTimeArrival,
                actualTimeArrival: data.actualTimeArrival,
                estimatedTimeDeparture: data.estimatedTimeDeparture,
                actualTimeDeparture: data.actualTimeDeparture,
                voyageStatusCode: data.voyageStatusCode,
                originPortId: data.originPortId,
                previousPortId: data.previousPortId,
                nextPortId: data.nextPortId
            });
            console.log('after', query)
            const temp = query && query.length > 0 && query[0].Result === 'OK' ? true : false;
            const returnData = temp ? { message: 'Inserting info has been done successfully', voyageId: query[0].VoyageId } : 'failure in inserting info';
            return SendResponse(req, res, returnData, temp, 200)
        } catch (error) {
            console.log('errorr ', error)
            return SendResponse(req, res, 'Fail in inserting voyage info', false, 500)
        }
    })
    .put(async (req, res) => {
        try {
            const data = req.body
            console.log('befor', data)
            let query = await db.query(queries.VOYAGE.updateVoyage, {
                vesselId: data.vesselId,
                voyageNoIn: data.voyageNoIn,
                voyageNoOut: data.voyageNoOut,
                voyageVessel: data.voyageVessel,
                ownerId: data.ownerId,
                agentId: data.agentId,
                estimatedTimeArrival: data.estimatedTimeArrival,
                actualTimeArrival: data.actualTimeArrival,
                estimatedTimeDeparture: data.estimatedTimeDeparture,
                actualTimeDeparture: data.actualTimeDeparture,
                voyageStatus: data.voyageStatus,
                originPort: data.originPort,
                previousPort: data.previousPort,
                nextPort: data.nextPort,
                voyageId: data.voyageId
            });
            console.log('after', query)
            const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
            const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
            return SendResponse(req, res, message, temp, 200)
        } catch (error) {
            console.log('errorr ', error)
            return SendResponse(req, res, 'Fail in updating voyage info', false, 500)
        }
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
