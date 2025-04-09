import { apiRoutes } from "../constants/apiRoutes";
import api from "./axios";

export const getAllOfficesAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_ALL_OFFICES);
    return res.data;
}

export const getOfficeOccupancyAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_OFFICE_OCCUPANCY);
    return res.data;
}