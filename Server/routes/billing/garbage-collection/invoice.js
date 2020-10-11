const express = require("express");
const router = express.Router();
const { SendResponse, GenerateInvoiceNo, ToPersian,ConvertProperties,FormatNumber } = require("../../../util/utility");
const queries = require("../../../util/T-SQL/queries");
const setting = require("../../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router.route('/:id?')
    .get(async (req, res) => {
        if (req.params.id) {
            let invoice = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadById, { invoiceId: req.params.id }))[0];
            if (!invoice)
                return SendResponse(req, res, 'Invoice not found', false, 404)
            invoice.InvoiceDate = ToPersian(invoice.InvoiceDate);
            return SendResponse(req, res, invoice)
        }
        let invoiceList = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadLastAllbills));
        invoiceList.forEach(invoice => {
            ConvertProperties(invoice,['InvoiceDate'],ToPersian);
            ConvertProperties(invoice,['PriceD','PriceR','Rate'],FormatNumber);
        });
        return SendResponse(req, res, invoiceList)
    })
    .post(async (req, res) => {
        try {
            //#region Load Voyage detail
            let voyage = (await db.query(queries.VOYAGE.loadVoyageDwellById, {
                VoyageId: req.body.voyageId
            }))
            if (voyage.length == 0)
                return SendResponse(req, res, 'Voyage not found', false, 404)
            let { Dwell, GrossTonage } = voyage[0];
            //#endregion

            //#region Load Tariff
            let tariff = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadTariff, { tonage: GrossTonage }))[0];

            if (!tariff)
                return SendResponse(req, res, 'Tariff data not found', false, 404)

            let currency = (await db.query(queries.BASIC_INFO.CURRENCY.loadLastCurrency))[0];
            if (!currency)
                return SendResponse(req, res, 'Currency data not found', false, 404)

            let lastInvoiceNo = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadLastBill))[0];
            console.log("lastInvoiceNo", GenerateInvoiceNo(lastInvoiceNo, 'GC'))
            //#endregion

            //#region calculate bill

            let invoice = {
                tariffId: tariff.GarbageCollectionTariffDetailId,
                dwellHour: Dwell,
                priceD: Dwell * tariff.Price,
                priceR: Dwell * tariff.Price * currency.Rate,
                voyageId: req.body.voyageId,
                currencyId: currency.CurrencyId,
                invoiceNo: req.body.isPreInvoice ? '---' : GenerateInvoiceNo(lastInvoiceNo, 'GC'),
                userId: '220'
            }
            console.log("invoice", invoice)
            if (!req.body.isPreInvoice)
                await db.query(queries.BILLING.GARBAGE_COLLECTION.calculateBill, invoice);
            //#endregion

            SendResponse(req, res, invoice)
        }
        catch (ex) {
            SendResponse(req, res, ex.originalError.message, false)
        }
    })
    .put(async (req, res) => {
        //body: {status,invoiceId}
        try {
            await db.query(queries.BILLING.GARBAGE_COLLECTION.changeStatus, { status: req.body.status, id: req.body.invoiceId })
            SendResponse(req, res, 'Invoice updated successfully')
        }
        catch (ex) {
            SendResponse(req, res, ex.originalError.message, false)
        }


    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
