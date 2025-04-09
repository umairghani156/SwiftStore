import { apiRoutes } from "../constants/apiRoutes";
import api from "./axios";

export const getAllServicesAPI = async () => {
    const res = await api.get(apiRoutes.GET_ALL_SERVICES);
    return res.data;
};