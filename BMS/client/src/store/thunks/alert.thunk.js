import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllAlertsAPI, getTypeWiseAlertsAPI, getVisitorStatsAPI, markAllAlertsReadAPI } from "../../api/alertAPI";

export const getTypeWiseAlertsThunk = createAsyncThunk("alert/getTypeWiseAlerts", async (type, thunkAPI) => {
    try {
        const res = await getTypeWiseAlertsAPI(type);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
    }
});

export const getAlertStatsThunk = createAsyncThunk("alert/getAlertStats", async (_, thunkAPI) => {
    try {
        const res = await getVisitorStatsAPI();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
    }
});

export const getAllAlertsThunk = createAsyncThunk("alert/getAllAlerts", async (_, thunkAPI) => {
    try {
        const res = await getAllAlertsAPI();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
    }
});

export const markAllAlertsAsReadThunk = createAsyncThunk("alert/markAllAlertsAsRead", async (_, thunkAPI) => {
    try {
        const res = await markAllAlertsReadAPI();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
    }
})