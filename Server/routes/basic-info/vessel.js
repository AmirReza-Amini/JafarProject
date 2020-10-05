const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);


router.route('/getVesselTypes')
    .get(async (req, res) => {
        let result = await db.query(queries.BASIC_INFO.VESSEL.getVesselTypes);
        console.log("result", result)
        SendResponse(req, res, result)
    })

router.route('/')
    // .get(async (req, res) => {
    //     SendResponse(req, res, { capitan: 'loaded' })
    // })
    .get(async (req, res) => {
        let result = await db.query(queries.BASIC_INFO.VESSEL.getVesselsList)
        console.log("result", result)
        SendResponse(req, res, result)
    })
    .post(async (req, res) => {
        try {
            const data = req.body
            console.log('befor' , req.body)
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
            return SendResponse(req, res, 'Fail in updating vessel info',false, 500)
        }
    })
    .put(async (req, res) => {
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
            
            return SendResponse(req, res, 'Fail in updating vessel info',false, 500)
        }
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
