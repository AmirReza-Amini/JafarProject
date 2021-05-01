const express = require("express");
const router = express.Router();
const {
  SendResponse,
  GenerateInvoiceNo,
  ToPersian,
  FormatNumber,
  ConvertProperties,
} = require("../../../util/utility");
const queries = require("../../../util/T-SQL/queries");
const setting = require("../../../app-setting");
const { CalculateGcInvoice, CalculateVsInvoice } = require("../CalculateBills");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

router
  .route("/:id?")
  .get(async (req, res) => {
    if (req.params.id) {
      let invoice = (
        await db.query(queries.BILLING.VESSEL_STOPPAGE.loadById, {
          invoiceId: req.params.id,
        })
      )[0];
      ConvertProperties(invoice, ["InvoiceDate", "ATA", "ATD"], ToPersian);
      ConvertProperties(invoice, ["PriceD", "PriceR", "Rate"], FormatNumber);

      return SendResponse(req, res, invoice);
    }
    let invoiceList = await db.query(
      queries.BILLING.VESSEL_STOPPAGE.loadAllbills
    );
    invoiceList.forEach((invoice) => {
      ConvertProperties(invoice, ["InvoiceDate", "ATA", "ATD"], ToPersian);
      ConvertProperties(invoice, ["PriceD", "PriceR", "Rate"], FormatNumber);
    });
    return SendResponse(req, res, invoiceList);
  })
  .post(async (req, res) => {
    //body: {voyageId,isPreInvoice}
    try {
      //#region Load Voyage detail
      let voyage = await db.query(queries.VOYAGE.loadVoyageDwellById, {
        VoyageId: req.body.voyageId,
      });
      if (voyage.length == 0)
        return SendResponse(req, res, "Voyage not found", false, 404);

      let discount = await db.query(queries.BILLING.COMMON.loadDiscount);
      if (!discount)
        return SendResponse(req, res, "Discount data not found", false, 404);

      let currency = (
        await db.query(queries.BASIC_INFO.CURRENCY.loadLastCurrency)
      )[0];
      if (!currency)
        return SendResponse(req, res, "Currency data not found", false, 404);

      voyage.voyageId = req.body.voyageId;
      let GcInvoice = await CalculateGcInvoice(voyage, currency, discount);
      let VsInvoice = await CalculateVsInvoice(voyage, currency, discount);
     
      let lastCover = await db.query(
        queries.BILLING.INVOICE_COVER.loadLastCoverNo
        );
        let lastCoverNo =
        lastCover.length != 0 ? lastCover[0].InvoiceCoverNo : "";
        
        let IcTable = db.model({ table: "InvoiceCover" });
        let VsTable = db.model({ table: "VesselStopageInvoices" });
        let GcTable = db.model({ table: "GarbageCollectionInvoices" });
        
        if (!GcInvoice.hasError && !VsInvoice.hasError) {
          // db.transaction(() => {
            var icBill = IcTable({
              InvoiceCoverNo: GenerateInvoiceNo(lastCoverNo, "IC"),
              InvoiceCoverDate: new Date(),
              IsPaid: false,
              Status: 1,
              SumInvoicePriceD: VsInvoice.data.priceD + GcInvoice.data.priceD,
              SumInvoicePriceR: VsInvoice.data.priceR + GcInvoice.data.priceR,
              VoyageId: req.body.voyageId,
              UserId: 220,
              VsTable: (ic) => [VsTable({ ...VsInvoice.data, InvoiceCover: ic })],
              GcTable: (ic) => [GcTable({ ...GcInvoice.data, InvoiceCover: ic })],
            });
            
            
            if (req.body.isPreInvoice) {
              return SendResponse(req, res, { icBill, GcInvoice, VsInvoice });
            }
        icBill
          .save()
          .then(() => console.log("Invoice issued successfuly"))
          .catch((ex) => {
            console.log(ex);
          });
        return SendResponse(req, res, { icBill, GcInvoice, VsInvoice });
        // })
      }
    } catch (ex) {
      SendResponse(req, res, ex.originalError.message, false);
    }
  })
  .put(async (req, res) => {
    //body: {status,invoiceId}
    try {
      await db.query(queries.BILLING.VESSEL_STOPPAGE.changeStatus, {
        status: req.body.status,
        id: req.body.invoiceId,
      });
      SendResponse(req, res, "Invoice updated successfully");
    } catch (ex) {
      SendResponse(req, res, ex.originalError.message, false);
    }
  });

module.exports = router;
