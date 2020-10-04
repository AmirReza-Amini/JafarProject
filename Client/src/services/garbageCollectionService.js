import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/billing/garbage-collection";

export const GetAllTariffs = () => {
    return http.get(apiEndpoint + '/tariff')
}

export const GetTariffDetails = (id) => {
    return http.get(apiEndpoint + '/tariff/' + id)
}