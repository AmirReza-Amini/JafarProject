const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);
var port = db.model({
    table: 'Ports',
    addPort: function (newPort) {
        this.portName = newPort.name,
            this.symbol = newPort.symbol || '---'
    }
});
router.route('/')
    .get(async (req, res) => {
        console.log("req", req)
        let result = await db.query("SELECT * from Ports")

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
