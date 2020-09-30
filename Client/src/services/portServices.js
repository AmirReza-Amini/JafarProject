import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/port/";

export const getPorts = () =>{
    return http.get(apiEndpoint)
}

