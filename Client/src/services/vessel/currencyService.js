import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/currency/";
export const getcurrencies = () => {
    return http.get(apiEndpoint)
}