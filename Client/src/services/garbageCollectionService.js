import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/billing/garbage-collection";

export const getAllTariffs = () => {
    return http.get(apiEndpoint + 'tariff')  
}