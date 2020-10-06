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
        SendResponse(req, res, { capitan: 'Updated' })
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
