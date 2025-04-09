import { apiRoutes } from "../constants/apiRoutes";
import api from "./axios";

export const getTypeWiseAlertsAPI = async (type)=>{
    const res = await api.get(apiRoutes.GET_TYPE_WISE_ALERTS+type);
    return res.data;
};

export const getVisitorStatsAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_ALERT_STATS);
    return res.data;
};

export const getAllAlertsAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_ALL_ALERTS);
    return res.data;
};

export const markAllAlertsReadAPI = async ()=>{
    const res = await api.put(apiRoutes.MARK_ALL_ALERTS_READ);
    return res.data;
};