const express = require("express");
const router = express.Router();
const { SendResponse, ToPersian, ConvertProperties, FormatNumber } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require("../../middleware/auth");
const db = sworm.db(setting.db.sqlConfig);
const { DoesUserHavePermission } = require("../../util/CheckPermission");

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
            if (req.params.id) {
                let result = (await db.query(queries.VOYAGE.loadVoyageDataById, { voyageId: req.params.id }))[0]
                setTimeout(() => {
                    console.log("result")
                }, 2000);
                ConvertProperties(result, ['ETA', 'ATA', 'ETD', 'ATD', 'gcInvoiceDate', 'vsInvoiceDate'], ToPersian);
                ConvertProperties(result, ['gcPriceR', 'PriceD', 'vsPriceR', 'vsPriceD', 'GrossTonage', 'VesselLength'], FormatNumber);
                return SendResponse(req, res, result);
            }
            let result = await db.query(queries.VOYAGE.getVoyageList)
            console.log("req.params.id", result)
            return SendResponse(req, res, result);
        } catch (error) {
            return SendResponse(req, res, 'get-voyageById', false, 500);
        }
    })
    .post(auth,async (req, res) => {
        console.log('from voyage post: ',req.body)
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VOYAGES-CREATE');
        console.log('check', check)
        if (check.result) {
            try {
                const data = req.body
                console.log('befouerr', data)
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

                const returnData = temp ? { message: 'Inserting info has been done successfully', voyageId: query[0].VoyageId } : 'failureeeeeeee in inserting info';
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
    .put(auth,async (req, res) => {
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
                console.log('after', data)
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
    .delete(auth,async (req, res) => {
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
