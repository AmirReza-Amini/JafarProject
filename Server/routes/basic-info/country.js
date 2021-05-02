const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require("../../util/CheckPermission");

var country = db.model({
    table: 'Countries',
    addCountry: function (newCountry) {
        this.countryName = newCountry.name,
            this.symbol = newCountry.symbol || '---'
    }
});

router.route('/')
    .get(async (req, res) => {
        try {
            let result = await db.query("SELECT * from Countries")
            return SendResponse(req, res, result)
        } catch (error) {
            return SendResponse(req, res, 'get-countries', false, 500);
        }
    })
    .post(auth, async (req, res) => {
     
        if (!req.body)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-COUNTRIES-CREATE');
        if (check.result) {
            try {
                var newCountry = country();
                newCountry.addCountry(req.body);
                let result = await newCountry.save()
                return SendResponse(req, res, { capitan: result })
            } catch (error) {
                return SendResponse(req, res, 'post-countries', false, 500);
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .put(auth, async (req, res) => {
        if (!req.body.countryId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-COUNTRIES-UPDATE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Updated' });
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })
    .delete(auth, async (req, res) => {
        if (!req.body.countryId)
            return SendResponse(req, res, "Input data is not valid", false, 400);
        const check = await DoesUserHavePermission(req.user, 'BASIC-INFORMATION-COUNTRIES-DELETE');
        if (check.result) {
            //DOEING SOMETHING...
            return SendResponse(req, res, { capitan: 'Deleted' })
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
    })

module.exports = router;
