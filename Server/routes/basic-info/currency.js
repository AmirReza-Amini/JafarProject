const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require("../../util/CheckPermission");

router.route('/')
    .get(async (req, res) => {
        SendResponse(req, res, { capitan: 'Read' })
    })
    .post(auth, async (req, res) => {
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-CURRENCY-CREATE');
        if (check.result) {
            // DOEING SOMETHING ...
            return SendResponse(req, res, { capitan: 'Added' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .put(auth, async (req, res) => {
        if (!req.body.currencyId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-CURRENCY-UPDATE');
        if (check.result) {
            // DOEING SOMETHING ...
            return SendResponse(req, res, { capitan: 'Updated' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(auth, async (req, res) => {
        if (!req.body.currencyId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-CURRENCY-DELETE');
        if (check.result) {
            // DOEING SOMETHING ...
            SendResponse(req, res, { capitan: 'Deleted' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
