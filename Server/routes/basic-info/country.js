const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const _ = require("lodash");
const md5 = require("md5");
const db = sworm.db(setting.db.sqlConfig);

var country = db.model({
    table: 'Countries',
    addCountry: function (newCountry) {
        this.countryName = newCountry.name,
            this.symbol = newCountry.symbol || '---'
    }
});

router.route('/')
    .get(async (req, res) => {

        console.log("req", req)
        let result = await db.query("SELECT * from Countries")

        SendResponse(req, res, result)
    })
    .post(async (req, res) => {
        var newCountry = country();
        newCountry.addCountry(req.body);
        let result = await newCountry.save()
        SendResponse(req, res, { capitan: result })
    })
    .put(async (req, res) => {
        SendResponse(req, res, { capitan: 'Updated' })
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
