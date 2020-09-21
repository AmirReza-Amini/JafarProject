import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/country/";

export const getCountries = () =>{
    return http.get(apiEndpoint)
}


