import { apiRoutes } from "../constants/apiRoutes";
import api from "./axios";

export const getAllIssuesAPI = async (pag) => {
  const res = await api.get(apiRoutes.GET_ALL_ISSUES + `?page=${pag.currentPage}&limit=${pag.limit}`);
  return res.data;
}

export const updateIssueAPI = async (data) => {
  const res = await api.patch(apiRoutes.UPDATE_ISSUE_BY_ID+"/"+data.id, {status:data.status, assignedTo:data.assignedTo});
  return res.data;
}


export const getIssueStatusCountAPI = async () => {
  const res = await api.get(apiRoutes.GET_ISSUE_STATUS_COUNT);
  return res.data;
}

// Get a User's All Reports

export const getUserIssuesAPI = async (pagination) => {
  const res = await api.get(apiRoutes.GET_USER_ISSUES + `?page=${pagination.currentPage}&limit=${pagination.limit}`);
  return res.data;
};

// Add a Report

export const addIssueAPI = async (data) => {
  const res = await api.post(apiRoutes.ADD_ISSUE, data);
  return res.data;
};

export const getSpecialIssueAPI = async (name) =>{
  const res = await api.get(apiRoutes.GET_SPECIAL_ISSUE+name);
  return res.data;
};

export const addSpecialIssueAPI = async (data) => {
  const res = await api.post(apiRoutes.ADD_ISSUE, data);
  return res.data;
};