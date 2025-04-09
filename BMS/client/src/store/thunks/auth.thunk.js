import { createAsyncThunk } from "@reduxjs/toolkit";
import { addUserAPI, deleteuserAPI, getAllTenantsAPI, getAllUsersAPI, loginAPI, updateUserAPI } from "../../api/authApi";
import { apiRoutes } from "../../constants/apiRoutes";
import {Navigate} from 'react-router-dom'
import toast from "react-hot-toast";

export const login = createAsyncThunk("auth/login", async(credentials, thunkAPI)=>{
    try {
      const data = await loginAPI(credentials);
      if(data.success){
        toast.success(data.message);
      }
      return data;

    } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});

// Get All Users Thunk

export const getAllUsersThunk  = createAsyncThunk("auth/getAllUsers", async (_, thunkAPI) => {
  try {
    const res = await getAllUsersAPI();
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  };
});

// Add a User

export const addUserThunk = createAsyncThunk("auth/addUser", async (data, thunkAPI) => {
  try {
    const res = await addUserAPI(data);
    if(res.success){
      toast.success(res.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  };
})

// Update User

export const updateUserThunk = createAsyncThunk("auth/updateUser", async (data, thunkAPI) => {
  try {
    const res = await updateUserAPI(data);
    if(res.success){
      toast.success(res.message);
    }
    return res;
  } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  };
});

export const deleteUserThunk = createAsyncThunk("auth/deleteUser", async (id, thunkAPI) => {
  try {
    const res = await deleteuserAPI(id);
    if(res.success){
      toast.success(res.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  };
});


export const getAllTenantsThunk = createAsyncThunk("auth/getAllTenants", async (pagination, thunkAPI) => {
  try {
    const res = await getAllTenantsAPI(pagination);
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  };
})
