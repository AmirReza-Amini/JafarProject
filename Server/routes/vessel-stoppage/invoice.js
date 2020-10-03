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

        //body: {voyageId,isPreInvoice}
        try {
            //#region Load Voyage detail
            let voyage = (await db.query(queries.VOYAGE.loadVoyageDwellById, {
                VoyageId: req.body.voyageId
            }))
            if (voyage.length == 0)
                return SendResponse(req, res, 'Voyage not found', false, 404)
            let { Dwell, VesselType } = voyage[0];
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
            if (!req.body.isPreInvoice)
                await db.query(queries.BILLING.VESSEL_STOPPAGE.calculateBill, invoice);

            SendResponse(req, res, invoice)
            //#endregion
        }
        catch (ex) {
            SendResponse(req, res, ex.originalError.message, false)
        }

    })
    .put(async (req, res) => {
         //body: {status,invoiceId}
        try {
            await db.query(queries.BILLING.VESSEL_STOPPAGE.changeStatus, { status: req.body.status, id: req.body.invoiceId })
            SendResponse(req, res, 'Invoice updated successfully')
        }
        catch (ex) {
            SendResponse(req, res, ex.originalError.message, false)
        }
    })

module.exports = router;
