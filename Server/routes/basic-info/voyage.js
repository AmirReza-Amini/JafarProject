const express = require("express");
const router = express.Router();
const { SendResponse, ToPersian, ConvertProperties } = require("../../util/utility");
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
        //ConvertProperties(voyageData, ['ETA', 'ATA', 'ETD', 'ATD'], ToPersian)
        let result = await db.query(queries.VOYAGE.getVoyageList)
        SendResponse(req, res, result)
    })
    .post(async (req, res) => {
        SendResponse(req, res, { capitan: 'Added' })
    })
    .put(async (req, res) => {
        try {
            const data = req.body
            console.log('befor' , data)
            let query = await db.query(queries.VOYAGE.updateVoyage, {
                vesselId: data.vesselId,
                voyageNoIn:data.voyageNoIn,
                voyageNoOut :data.voyageNoOut,
                voyageVessel:data.voyageVessel,
                ownerId:data.ownerId,
                agentId:data.agentId,
                estimatedTimeArrival:data.estimatedTimeArrival,
                actualTimeArrival:data.actualTimeArrival,
                estimatedTimeDeparture:data.estimatedTimeDeparture,
                actualTimeDeparture:data.actualTimeDeparture,
                voyageStatus:data.voyageStatus,
                originPort:data.originPort,
                previousPort:data.previousPort,
                nextPort:data.nextPort,
                voyageId: data.voyageId
            });
            console.log('after', query)
            const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
            const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
            return SendResponse(req, res, message, temp, 200)
        } catch (error) {
            console.log('errorr ', error)
            return SendResponse(req, res, 'Fail in updating voyage info',false, 500)
        }
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
