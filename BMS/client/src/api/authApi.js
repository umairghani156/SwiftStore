import { apiRoutes } from "../constants/apiRoutes"
import api from "./axios"

export const loginAPI = async (data)=>{
        const response = await api.post(apiRoutes.LOGIN, data);
        return response.data
   
}

export const getAllUsersAPI = async ()=>{
    const response = await api.get(apiRoutes.GET_ALL_USERS);
    return response.data
}

export const addUserAPI = async (data)=>{
    const response = await api.post(apiRoutes.REGISTER, data);
    return response.data
}

export const updateUserAPI = async (data)=>{
    const response = await api.put(apiRoutes.UPDATE_USER_BY_ID+data._id, data);
    return response.data
};

export const deleteuserAPI = async (id)=>{
    const response = await api.delete(apiRoutes.DELETE_USER_BY_ID+id);
    return response.data
};

export const getAllTenantsAPI = async (pagination)=>{
  const response = await api.get(apiRoutes.GET_ALL_TENANTS + `?page=${pagination.currentPage}&limit=${pagination.limit}`);
  return response.data
}

export const resetPasswordAPi = async (data)=>{
    try {
        console.log(data);
        const response = await api.post(apiRoutes.FORGET_PASSWORD, {
            email: data
        });
        return response.data
    } catch (error) {
        return error
    }
};

export const changePasswordAPI = async (data)=>{
    try {
        const response = await api.put(apiRoutes.CHANGE_PASSWORD+data.url, {
            password: data.password
        });
        return response.data
    } catch (error) {
        return error
    }
}