const express = require("express");
const router = express.Router();
const { SendResponse, ToPersian, ConvertProperties } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.route('/:id?')
    .get(async (req, res) => {
        let voyageData = (await db.query(queries.VOYAGE.loadVoyageDataById, { voyageId: req.params.id }))[0];
        SendResponse(req, res, ConvertProperties(voyageData, ['ETA', 'ATA', 'ETD', 'ATD'], ToPersian))
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
