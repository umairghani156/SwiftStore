import { apiRoutes } from "../constants/apiRoutes";
import api from "./axios";

// Add Visitor 

export const addVisitorAPI = async (visitorData)=>{
    const res = await api.post(apiRoutes.ADD_VISITOR, visitorData);
    return res.data;
}
export const getAllVisitorsAPI = async (page)=>{
    const res = await api.get(apiRoutes.GET_ALL_VISITORS+`?page=${page.currentPage}&limit=${page.limit}`);
    return res.data;
}


// Get Visitor Count

export const getVisitorCountAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_VISITORS_COUNT);
    return res.data;
}

// Get Hourly Visitor Flow

export const getHourlyVisitorFlowAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_HOURLY_VISITOR_FLOW);
    return res.data;
};


// Update Visitor

export const updateVisitorAPI = async (data)=>{
    const res = await api.put(apiRoutes.UPDATE_VISITOR_BY_ID+data.id, data);
    return res.data;
};


// Visitor Analytics

export const getVisitorsAnalyticsAPI = async ()=>{
    const res = await api.get(apiRoutes.GET_VISITORS_ANALYTICS);
    return res.data;
};

// Check In Visitor
export const checkInVisitorAPI = async (data)=>{
    const res = await api.patch(apiRoutes.CHECK_IN_VISITOR + data.id, {check_in:data.check_in, check_out:data.check_out});
    return res.data;
};

// Get All Appointments
export const getAllAppoinmentsAPI = async (pagination) =>{
    const res = await api.get(apiRoutes.GET_ALL_APPOINTMENTS + `?page=${pagination.currentPage}&limit=${pagination.limit}`);
    return res.data;
}