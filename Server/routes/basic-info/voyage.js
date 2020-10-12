const express = require("express");
const router = express.Router();
const { SendResponse, ToPersian, ConvertProperties, FormatNumber } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.get('/get-last-voyages', async (req, res) => {
    try {
        let result = await db.query(queries.VOYAGE.getLast10Voyages)
        return SendResponse(req, res, result);
    } catch (error) {
        return SendResponse(req, res, 'get-last-voyages', false, 500);
    }
})

router.route('/:id?')
    .get(async (req, res) => {
        try {
            //console.log("req.params.id", req.params.id)
            if (req.params.id) {
                let result = (await db.query(queries.VOYAGE.loadVoyageDataById, { voyageId: req.params.id }))[0]
                ConvertProperties(result, ['ETA', 'ATA', 'ETD', 'ATD', 'InvoiceDate', 'vsInvoiceDate'], ToPersian);
                ConvertProperties(result, ['PriceR', 'PriceD', 'vsPriceR', 'vsPriceD', 'GrossTonage', 'VesselLength'], FormatNumber);
                //console.log("result", result)
                return SendResponse(req, res, result);
            }
            let result = await db.query(queries.VOYAGE.getVoyageList)
            return SendResponse(req, res, result);
        } catch (error) {
            return SendResponse(req, res, 'get-voyageById', false, 500);
        }
    })
    .post(async (req, res) => {
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VOYAGES-CREATE');
        if (check.result) {
            try {
                const data = req.body
                //console.log('befor', data)
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
                //console.log('after', query)
                const temp = query && query.length > 0 && query[0].Result === 'OK' ? true : false;
                const returnData = temp ? { message: 'Inserting info has been done successfully', voyageId: query[0].VoyageId } : 'failure in inserting info';
                return SendResponse(req, res, returnData, temp, 200)
            } catch (error) {
                //console.log('errorr ', error)
                return SendResponse(req, res, 'Fail in inserting voyage info', false, 500)
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }

    })
    .put(async (req, res) => {
        if (!req.body.voyageId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VOYAGES-UPDATE');
        if (check.result) {
            try {
                const data = req.body
                //console.log('befor', data)
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
                //console.log('after', query)
                const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
                const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
                return SendResponse(req, res, message, temp, 200)
            } catch (error) {
                //console.log('errorr ', error)
                return SendResponse(req, res, 'Fail in updating voyage info', false, 500)
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(async (req, res) => {
        if (!req.body.voyageId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VOYAGES-DELETE');
        if (check.result) {
            //DOEING SOMEHTING...
            return SendResponse(req, res, { capitan: 'Deleted' });
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
