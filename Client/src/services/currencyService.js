import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/currency/";

export const getCurrencies = () =>{
    return http.get(apiEndpoint)
}

export const addNewCurrency = (currencyInfo) => {
    console.log('AddshippingLineInfo', currencyInfo)
    return http.post(apiEndpoint, currencyInfo);
}