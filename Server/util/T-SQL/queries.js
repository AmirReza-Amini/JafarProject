const { LoadText } = require("../utility");

module.exports = {
  BASIC_INFO: {
    VESSEL: {
      getVesselTypes: LoadText(
        __dirname + "/basic-info/vessel/get-vessel-types.sql"
      ),
      getVesselsList: LoadText(
        __dirname + "/basic-info/vessel/get-vessels-list.sql"
      ),
      updateVessel: LoadText(
        __dirname + "/basic-info/vessel/update-vessel.sql"
      ),
      insertVessel: LoadText(
        __dirname + "/basic-info/vessel/insert-vessel.sql"
      ),
    },
    SHIPPINGLINE: {
      getShippingLinesList: LoadText(
        __dirname + "/basic-info/shippingLine/get-shippingLines-list.sql"
      ),
      updateShippingLine: LoadText(
        __dirname + "/basic-info/shippingLine/update-shippingLine.sql"
      ),
      insertShippingLine: LoadText(
        __dirname + "/basic-info/shippingLine/insert-shippingLine.sql"
      ),
    },
    CURRENCY: {
      loadLastCurrency: LoadText(
        __dirname + "/basic-info/currency/load-last-currency.sql"
      ),
    },
  },
  VOYAGE: {
    getVoyageList: LoadText(__dirname + "/basic-info/voyage/get-voyages-list.sql"),
    insertVoyage: LoadText(__dirname + "/basic-info/voyage/insert-voyage.sql"),
    updateVoyage: LoadText(__dirname + "/basic-info/voyage/update-voyage.sql"),
    loadVoyageDwellById: LoadText(
      __dirname + "/voyage/load-voyage-dwell-by-id.sql"
    ),
    loadVoyageDataById: LoadText(
      __dirname + "/voyage/load-voyage-data-by-id.sql"
    ),
  },
  BILLING: {
    GARBAGE_COLLECTION: {
      loadTariff: LoadText(
        __dirname + "/billing/garbage-collection/load-tariff.sql"
      ),
      calculateBill: LoadText(
        __dirname + "/billing/garbage-collection/calculate-bill.sql"
      ),
      loadLastBill: LoadText(
        __dirname + "/billing/garbage-collection/load-last-bill.sql"
      ),
      loadById: LoadText(
        __dirname + "/billing/garbage-collection/load-bill-by-id.sql"
      ),
      loadLast15bills: LoadText(
        __dirname + "/billing/garbage-collection/load-last-15-bills.sql"
      ),
      loadAllTariffs:LoadText(
        __dirname + "/billing/garbage-collection/load-all-tariffs.sql"
      ),
      loadTariffDetails:LoadText(
        __dirname + "/billing/garbage-collection/load-tariff-details.sql"
      )
    },
    VESSEL_STOPPAGE: {
      loadTariff: LoadText(
        __dirname + "/billing/vessel-stoppage/load-tariff.sql"
      ),
      calculateBill: LoadText(
        __dirname + "/billing/vessel-stoppage/calculate-bill.sql"
      ),
      loadLastBill: LoadText(
        __dirname + "/billing/vessel-stoppage/load-last-bill.sql"
      ),
      loadById: LoadText(
        __dirname + "/billing/vessel-stoppage/load-bill-by-id.sql"
      ),
      loadLast15bills: LoadText(
        __dirname + "/billing/vessel-stoppage/load-last-15-bills.sql"
      ),
    },
  },
};
