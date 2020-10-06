import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/basic-info/voyage/";


export const getVoyageTopTenOpen = (data) =>{
     return http.get(apiEndpoint)
 }

export const getLoadUnloadStatisticsByVoyageId = (data) =>{
   // console.log(apiEndpoint + '/getLoadUnloadStatisticsByVoyageId')
    return http.post(apiEndpoint + 'getLoadUnloadStatisticsByVoyageId',data)
}

export const getVoyage = () => {
    return http.get(apiEndpoint)
}

export const editVoyageInfo = (voyageInfo) => {
    return http.put(apiEndpoint, voyageInfo);
}

export const addNewVoyageInfo = (voyageInfo) => {
  console.log('AddVoyage', voyageInfo)
  return http.post(apiEndpoint, voyageInfo);
}

export const GetLast10Voyages=()=>{
    return http.post(apiEndpoint+'/get-last-voyages');
}