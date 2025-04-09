import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOfficesAPI, getOfficeOccupancyAPI } from "../../api/officeAPI";
import toast from "react-hot-toast";

export const getOfficeThunk = createAsyncThunk('office/getOffice', async (_, thunkAPI) => {
 try {
    const res = await getAllOfficesAPI();
    return res.data;
 } catch (error) {
   if(error.response.status === 401){
     localStorage.removeItem('token');
     localStorage.removeItem('user');
   };
   toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
 }
}) ;

export const getOfficeOccupancyThunk = createAsyncThunk('office/getOfficeOccupancy', async (_, thunkAPI) => {
  try {
     const res = await getOfficeOccupancyAPI();
     return res.data;
  } catch (error) {
   
    toast.error(error.response.data.message || "Something went wrong");
     return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
})