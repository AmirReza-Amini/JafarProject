const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const setting = require("../../app-setting");
const sworm = require("sworm");
const queries = require("../../util/T-SQL/queries");
const db = sworm.db(setting.db.sqlConfig);
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require("../../util/CheckPermission");

router
  .route("/")
  // .get(async (req, res) => {
  //     SendResponse(req, res, { capitan: 'Read' })
  // })
  .get(async (req, res) => {
    try {
      let result = await db.query("SELECT TOP 100 * FROM dbo.Currencies");
      console.log("currency :", result);
      return SendResponse(req, res, result);
    } catch (error) {
      return SendResponse(req, res, "get-currencies", false, 500);
    }
  })
  .post(auth, async (req, res) => {
    if (!req.body)
      return SendResponse(req, res, "Input data is not valid", false, 400);
    const check = await DoesUserHavePermission(
      req.user,
      "BASIC-INFORMATION-CURRENCY-CREATE"
    );
    check.result = true;
    if (check.result) {
      try {
        const data = req.body;
        console.log("beforssss", data.rate ,data.date);
        let query = await db.query(queries.BASIC_INFO.CURRENCY.insertCurrency, {
          rate: data.rate,
          date: data.date,
        });
        const temp =
          query && query.length > 0 && query[0].RESULT == true ? true : false;
        const message = temp
          ? "Inserting info complated successfully"
          : "failure in updating info";
        // DOEING SOMETHING ...
        return SendResponse(req, res, { capitan: "Added" });
      } catch (error) {
        return SendResponse(
          req,
          res,
          "Fail in updating currency info",
          false,
          500
        );
      }
    } else {
      return SendResponse(
        req,
        res,
        check.message,
        check.result,
        check.statusCode
      );
    }
  })
  .put(auth, async (req, res) => {
    if (!req.body.currencyId)
      return SendResponse(req, res, "Input data is not valid", false, 400);
    const check = await DoesUserHavePermission(
      req.user,
      "BASIC-INFORMATION-CURRENCY-UPDATE"
    );
    if (check.result) {
      // DOEING SOMETHING ...
      return SendResponse(req, res, { capitan: "Updated" });
    } else {
      return SendResponse(
        req,
        res,
        check.message,
        check.result,
        check.statusCode
      );
    }
  })
  .delete(auth, async (req, res) => {
    if (!req.body.currencyId)
      return SendResponse(req, res, "Input data is not valid", false, 400);
    const check = await DoesUserHavePermission(
      req.user,
      "BASIC-INFORMATION-CURRENCY-DELETE"
    );
    if (check.result) {
      // DOEING SOMETHING ...
      SendResponse(req, res, { capitan: "Deleted" });
    } else {
      return SendResponse(
        req,
        res,
        check.message,
        check.result,
        check.statusCode
      );
    }
  });

module.exports = router;
