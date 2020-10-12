const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require("../../util/CheckPermission");

var port = db.model({
    table: 'Ports',
    addPort: function (newPort) {
        this.portName = newPort.name,
            this.symbol = newPort.symbol || '---'
    }
});
router.route('/')
    .get(async (req, res) => {
        try {
            //console.log("req", req)
            let result = await db.query("SELECT * from Ports");
            return SendResponse(req, res, result);
        } catch (error) {
            return SendResponse(req, res, 'get-ports', false, 500);
        }
    })
    .post(auth, async (req, res) => {
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-PORTS-CREATE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Added' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .put(auth, async (req, res) => {
        if (!req.body.portId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-PORTS-UPDATE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Updated' });
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(auth, async (req, res) => {
        if (!req.body.portId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-PORTS-DELETE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Deleted' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
