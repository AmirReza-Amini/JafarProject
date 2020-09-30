import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/shippingLine/";

export const getShippingLines = () => {
    return http.get(apiEndpoint)
}

export const editShippingLineInfo = (shippingLineInfo) => {
    return http.put(apiEndpoint, shippingLineInfo);
}

export const addNewshippingLineInfo = (shippingLineInfo) => {
  console.log('AddshippingLineInfo', shippingLineInfo)
  return http.post(apiEndpoint, shippingLineInfo);
}
