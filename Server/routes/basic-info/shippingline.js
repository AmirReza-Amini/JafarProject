const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.route('/')
.get(async (req, res) => {
    let result = await db.query(queries.BASIC_INFO.SHIPPINGLINE.getShippingLinesList)
    console.log("result", result)
    SendResponse(req, res, result)
})
.post(async (req, res) => {
    try {
        const data = req.body
        console.log('beforssss' , req.body)
        let query = await db.query(queries.BASIC_INFO.SHIPPINGLINE.insertShippingLine, {
            shippingLineName: data.shippingLineName,
            economicCode:data.economicCode,
            tel:data.tel,
            address:data.address,
            email:data.email,
            nationalCode:data.nationalCode
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
            console.log('befor' , req.body)
            let query = await db.query(queries.BASIC_INFO.SHIPPINGLINE.updateShippingLine, {
                shippingLineId: data.shippingLineId,
                shippingLineName:data.shippingLineName,
                tel:data.tel,
                email:data.email,
                address:data.address,
                nationalCode:data.nationalCode,
                economicCode:data.economicCode
            });
            const temp = query && query.length > 0 && query[0].RESULT == true ? true : false;
            const message = temp ? 'Updating info has been done successfully' : 'failure in updating info';
            console.log('after', query)
            return SendResponse(req, res, message, temp, 200)
        } catch (error) {
            return SendResponse(req, res, 'Fail in updating Shipping Line info',false, 500)
        }
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
