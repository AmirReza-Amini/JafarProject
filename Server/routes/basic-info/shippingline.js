const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require("../../util/CheckPermission");

router.route('/')
    .get(async (req, res) => {
        try {
            let result = await db.query(queries.BASIC_INFO.SHIPPINGLINE.getShippingLinesList)
            return SendResponse(req, res, result);
        } catch (error) {
            return SendResponse(req, res, 'get-shippinglines', false, 500);
        }
    })
    .post(auth, async (req, res) => {
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-SHIPPINGLINES-CREATE');
        if (check.result) {
            try {
                const data = req.body
                //console.log('beforssss', req.body)
                let query = await db.query(queries.BASIC_INFO.SHIPPINGLINE.insertShippingLine, {
                    shippingLineName: data.shippingLineName,
                    economicCode: data.economicCode,
                    tel: data.tel,
                    address: data.address,
                    email: data.email,
                    nationalCode: data.nationalCode
                });
                const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
                const message = temp ? 'Inserting info complated successfully' : 'failure in updating info';
                //console.log('after', query)
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
        if (!req.body.shippingLineId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-SHIPPINGLINES-UPDATE');
        if (check.result) {
            try {
                const data = req.body
                //console.log('befor', req.body)
                let query = await db.query(queries.BASIC_INFO.SHIPPINGLINE.updateShippingLine, {
                    shippingLineId: data.shippingLineId,
                    shippingLineName: data.shippingLineName,
                    tel: data.tel,
                    email: data.email,
                    address: data.address,
                    nationalCode: data.nationalCode,
                    economicCode: data.economicCode
                });
                const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
                const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
                //console.log('after', query)
                return SendResponse(req, res, message, temp, 200)
            } catch (error) {
                return SendResponse(req, res, 'Fail in updating Shipping Line info', false, 500)
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(auth, async (req, res) => {
        if (!req.body.shippingLineId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-SHIPPINGLINES-DELETE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Deleted' });
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
