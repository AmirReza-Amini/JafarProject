const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const { DoesUserHavePermission } = require("../../util/CheckPermission");
const db = sworm.db(setting.db.sqlConfig);
const auth = require("../../middleware/auth");


router.route('/getVesselTypes')
    .get(async (req, res) => {
        try {
            let result = await db.query(queries.BASIC_INFO.VESSEL.getVesselTypes);
            //console.log("result", result)
            return SendResponse(req, res, result);
        } catch (error) {
            return SendResponse(req, res, 'get-vesselTypes', false, 500);
        }
    })

router.route('/')
    .get(async (req, res) => {
        try {
            let result = await db.query(queries.BASIC_INFO.VESSEL.getVesselsList)
            // console.log("result", result)
            SendResponse(req, res, result)
        } catch (error) {
            return SendResponse(req, res, 'get-vessels', false, 500);
        }
    })
    .post(auth, async (req, res) => {
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VESSELS-CREATE');
        if (check.result) {
            try {
                const data = req.body
                console.log('befor', req.body)
                let query = await db.query(queries.BASIC_INFO.VESSEL.insertVessel, {
                    vesselName: data.vesselName,
                    vesselType: data.vesselType,
                    grossTonage: data.grossTonage,
                    flag: data.flag,
                    nationality: data.nationality,
                    vesselLength: data.vesselLength,
                    numOfBays: data.numOfBays,
                    activeCraneQty: data.activeCraneQty,
                    callSign: data.callSign
                });
                const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
                const message = temp ? 'Inserting info complated successfully' : 'failure in updating info';
                console.log('after', query)
                return SendResponse(req, res, message, temp, 200)
            } catch (error) {
                return SendResponse(req, res, 'Fail in updating vessel info', false, 500)
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .put(auth, async (req, res) => {
        if (!req.body.vesselId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VESSELS-UPDATE');
        console.log(' vessel put check', check);
        if (check.result) {
            try {
                const data = req.body
                //console.log('befor' , req.body)
                let query = await db.query(queries.BASIC_INFO.VESSEL.updateVessel, {
                    vesselId: data.vesselId,
                    vesselType: data.vesselType,
                    grossTonage: data.grossTonage,
                    flag: data.flag,
                    nationality: data.nationality,
                    vesselLength: data.vesselLength,
                    numOfBays: data.numOfBays,
                    activeCraneQty: data.activeCraneQty,
                    callSign: data.callSign
                });
                const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
                const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
                console.log('after', query)
                return SendResponse(req, res, message, temp, 200)
            } catch (error) {
                return SendResponse(req, res, 'Fail in updating vessel info', false, 500)
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(auth, async (req, res) => {
        if (!req.body.vesselId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-VESSELS-DELETE');
        if (check.result) {
            // DOING SOMETHING....
            return SendResponse(req, res, { capitan: 'Deleted' });
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
