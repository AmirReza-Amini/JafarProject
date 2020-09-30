const { LoadText } = require('../utility')


module.exports = {
    BASIC_INFO: {
        VESSEL: {
            getVesselTypes: LoadText(__dirname + '/basic-info/vessel/get-vessel-types.sql'),
            getVesselsList: LoadText(__dirname + '/basic-info/vessel/get-vessels-list.sql'),
            updateVessel: LoadText(__dirname + '/basic-info/vessel/update-vessel.sql'),
            insertVessel: LoadText(__dirname + '/basic-info/vessel/insert-vessel.sql')
        },
        CURRENCY: {
            loadLastCurrency: LoadText(__dirname + '/basic-info/currency/load-last-currency.sql')
        }
    },
    VOYAGE: {
        loadLastVoyages: LoadText(__dirname + '/voyage/load-last-voyages.sql'),
        loadVoyageDwellById: LoadText(__dirname + '/voyage/load-voyage-dwell-by-id.sql'),
        loadVoyageDataById: LoadText(__dirname + '/voyage/load-voyage-data-by-id.sql')
    },
    EQUIPMENT: {
        fetchEquipmentsForUnload: LoadText(__dirname + '/equipment/fetch-equipments-for-unload.sql')
    },
    OPERATOR: {
        fetchOperatorInfoBasedOnCode: LoadText(__dirname + '/operator/fetch-operator-info-based-on-code.sql')
    },
    VESSEL: {
        BERTH: {
            getCntrInfoForUnload: LoadText(__dirname + '/vessel/berth/get-cntr-info-for-unload.sql'),
            saveUnload: LoadText(__dirname + '/vessel/berth/save-unload.sql'),
            addToShifting: LoadText(__dirname + '/vessel/berth/add-to-shifting.sql'),
            addToLoadingList: LoadText(__dirname + '/vessel/berth/add-to-loading-list.sql'),
            isExistCntrInInstructionLoading: LoadText(__dirname + '/vessel/berth/is-exist-cntr-in-instruction-loading.sql'),
            saveUnloadIncrement: LoadText(__dirname + '/vessel/berth/save-unload-increment.sql')
        },
        DECK: {

        }
    },
    BILLING: {
        GARBAGE_COLLECTION: {
            loadTariff: LoadText(__dirname + '/billing/garbage-collection/load-tariff.sql'),
            calculateBill: LoadText(__dirname + '/billing/garbage-collection/calculate-bill.sql'),
            loadLastBill: LoadText(__dirname + '/billing/garbage-collection/load-last-bill.sql'),
            loadById: LoadText(__dirname + '/billing/garbage-collection/load-bill-by-id.sql'),
            loadLast15bills: LoadText(__dirname + '/billing/garbage-collection/load-last-15-bills.sql')
        },
        VESSEL_STOPPAGE: {
            loadTariff: LoadText(__dirname + '/billing/vessel-stoppage/load-tariff.sql'),
            calculateBill: LoadText(__dirname + '/billing/vessel-stoppage/calculate-bill.sql'),
            loadLastBill: LoadText(__dirname + '/billing/vessel-stoppage/load-last-bill.sql'),
            loadById: LoadText(__dirname + '/billing/vessel-stoppage/load-bill-by-id.sql'),
            loadLast15bills: LoadText(__dirname + '/billing/vessel-stoppage/load-last-15-bills.sql')
        }
    }

}