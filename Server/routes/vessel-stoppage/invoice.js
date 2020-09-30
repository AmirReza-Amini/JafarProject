const express = require("express");
const router = express.Router();
const { SendResponse, GenerateInvoiceNo, ToPersian } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.route('/:id?')
    .get(async (req, res) => {
        if (req.params.id) {
            let invoice = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadById, { invoiceId: req.params.id }))[0];
            invoice.InvoiceDate = ToPersian(invoice.InvoiceDate);
            return SendResponse(req, res, invoice)
        }
        let invoiceList = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadLast15bills));
        invoiceList.forEach(invoice => {
            invoice.InvoiceDate = ToPersian(invoice.InvoiceDate);
        });
        return SendResponse(req, res, invoiceList)
    })
    .post(async (req, res) => {
        //#region Load Voyage detail
        let { Dwell, VesselType } = (await db.query(queries.VOYAGE.loadVoyageDwellById, {
            VoyageId: req.body.voyageId
        }))[0]
        //#endregion

        //#region Load Tariff
        let tariff = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadTariff, { vesselType: VesselType }))[0];

        if (!tariff)
            return SendResponse(req, res, 'Tariff data not found', false, 404)

        let currency = (await db.query(queries.BASIC_INFO.CURRENCY.loadLastCurrency))[0];
        if (!currency)
            return SendResponse(req, res, 'Currency data not found', false, 404)

        let lastInvoice = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadLastBill))[0];
        //#endregion

        //#region calculate bill

        let price = Dwell > tariff.NormalHoure ? Dwell * tariff.ExtraPrice : Dwell * tariff.NormalPrice;

        let invoice = {
            tariffId: tariff.VesselStoppageTariffDetailId,
            dwell: Dwell,
            priceD: price,
            priceR: price * currency.Rate,
            voyageId: req.body.voyageId,
            currencyId: currency.CurrencyId,
            invoiceNo: GenerateInvoiceNo(lastInvoice, 'VS'),
            userId: '220'
        }
        console.log("isPreInvoice", req.body.isPreInvoice)
        if (!req.body.isPreInvoice)
            await db.query(queries.BILLING.VESSEL_STOPPAGE.calculateBill, invoice);
        //#endregion

        SendResponse(req, res, invoice)
    })
    .put(async (req, res) => {
        SendResponse(req, res, { capitan: 'Updated' })
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
