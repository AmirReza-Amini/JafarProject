const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../../util/utility");
const queries = require("../../../util/T-SQL/queries");
const setting = require("../../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.route('/:id?')
    .get(async (req, res) => {
        if (req.params.id) {
            let result = await db.query(queries.BILLING.GARBAGE_COLLECTION.loadTariffDetails, { id: req.params.id });
            return SendResponse(req, res, result)
        }
        let result = await db.query(queries.BILLING.GARBAGE_COLLECTION.loadAllTariffs);
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