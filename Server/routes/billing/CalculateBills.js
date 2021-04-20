const { GenerateInvoiceNo } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

exports.CalculateGcInvoice = async (voyage, currency, discountData) => {
    try {
        let { Dwell, GrossTonage, Flag } = voyage[0];
        let tariffGarbageCollection = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadTariff, { tonage: GrossTonage }))[0];

        if (!tariffGarbageCollection)
            return { data: 'Tariff data not found', hasError: true }

        let lastGcBill = (await db.query(queries.BILLING.GARBAGE_COLLECTION.loadLastBill));
        let GcInvoiceNo = lastGcBill.length != 0 ? lastGcBill[0].InvoiceNo : '';
        let DwellDays = Math.ceil(Dwell / 24);
        let discountPercent = discountData.filter(m => m.FlagId == Flag && m.ToGrossTonage > GrossTonage)[0];
        let dp = 1.0 - (discountPercent ? discountPercent.discountPercent : discountData.filter(m => m.FlagId == 0)[0].discountPercent);

        let invoice = {
            GarbageCollectionTariffId: tariffGarbageCollection.GarbageCollectionTariffDetailId,
            DwellDate: DwellDays,
            priceD: DwellDays * tariffGarbageCollection.Price * dp,
            priceR: DwellDays * tariffGarbageCollection.Price * dp * currency.Rate,
            voyageId: voyage.voyageId,
            InvoiceDate: new Date(),
            currencyId: currency.CurrencyId,
            invoiceNo: GenerateInvoiceNo(GcInvoiceNo, 'GC'),
            Status: 1,
            userId: '220'
        }
        return { data: invoice, hasError: false }
    }
    catch (ex) {
        return { data: ex, hasError: true }
    }
}

exports.CalculateVsInvoice = async (voyage, currency, discountData) => {
    try {
        let { Dwell, VesselType, GrossTonage, Flag } = voyage[0];
        let tariffVesselStoppage = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadTariff, { vesselType: VesselType }))[0];

        if (!tariffVesselStoppage)
            return { data: 'Tariff data not found', hasError: true }

        let lastVsBill = (await db.query(queries.BILLING.VESSEL_STOPPAGE.loadLastBill));
        let VsInvoiceNo = lastVsBill.length != 0 ? lastVsBill[0].InvoiceNo : '';

        let price = Dwell > tariffVesselStoppage.NormalHour ? tariffVesselStoppage.ExtraPrice : tariffVesselStoppage.NormalPrice;
        let discountPercent = discountData.filter(m => m.FlagId == Flag && m.ToGrossTonage > GrossTonage)[0];
        let dp = 1.0 - (discountPercent ? discountPercent.discountPercent : discountData.filter(m => m.FlagId == 0)[0].discountPercent);

        let invoice = {
            VesselStopageTariffId: tariffVesselStoppage.VesselStoppageTariffDetailId,
            DwellHour: Dwell,
            priceD: (Dwell * price * GrossTonage * dp) / 100,
            priceR: (Dwell * price * GrossTonage * dp * currency.Rate) / 100,
            voyageId: voyage.voyageId,
            InvoiceDate: new Date(),
            Status: 1,
            currencyId: currency.CurrencyId,
            invoiceNo: GenerateInvoiceNo(VsInvoiceNo, 'VS'),
            userId: '220'
        }
        return { data: invoice, hasError: false }
    }
    catch (ex) {
        return { data: ex, hasError: true }
    }
}