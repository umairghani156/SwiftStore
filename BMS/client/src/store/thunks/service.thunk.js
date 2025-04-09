import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllServicesAPI } from "../../api/servicesAPI";

export const getAllServices = createAsyncThunk("service/getAllServices", async (_, thunkAPI) => {
 try {
    const res = await getAllServicesAPI();
   // console.log("Services",res.data);
    return res.data;
 } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
 }
});