import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/billing/vessel-stoppage";

export const GetAllTariffs = () => {
    return http.get(apiEndpoint + '/tariff')
}

export const GetTariffDetails = (id) => {
    return http.get(apiEndpoint + '/tariff/' + id)
}

export const Calculate = (voyageId, isPreInvoice) => {
    console.log("Calculate -> voyageId", voyageId)
    return http.post(apiEndpoint + '/invoice/', { isPreInvoice: isPreInvoice, voyageId: voyageId });
}


export const GetAllBills = (param) => {
    return http.get(apiEndpoint + '/invoice' + (param ? '/' + param : ''))
} 