import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/vessel/";


export const getVesselTypes = () => {
    return http.get(apiEndpoint + 'getVesselTypes')
}


export const getVessels = () => {
    return http.get(apiEndpoint)
}


export const deleteVesselInfo = (vesselId) => {
    console.log(apiEndpoint + `/${vesselId}`)
    return http.delete(apiEndpoint + `/${vesselId}`);
}

export const editVesselInfo = (vesselInfo) => {
    console.log('editVessel', vesselInfo)
    return http.put(apiEndpoint, vesselInfo);
}