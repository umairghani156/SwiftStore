import { createSlice } from "@reduxjs/toolkit";
import { getAlertStatsThunk, getAllAlertsThunk, getTypeWiseAlertsThunk, markAllAlertsAsReadThunk } from "../thunks/alert.thunk";


const initialState = {
    alerts: null,
    alertStats: null,
    allAlerts: null,
    loading: false,
    error: null
}
const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTypeWiseAlertsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTypeWiseAlertsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.alerts = action.payload;
                state.error = null;
            })
            .addCase(getTypeWiseAlertsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Visitor Stats
            .addCase(getAlertStatsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAlertStatsThunk.fulfilled, (state, action) => {
                state.alertStats = action.payload;
                state.error = null;
            })
            .addCase(getAlertStatsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Alerts
            .addCase(getAllAlertsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAlertsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.allAlerts = action.payload;
                state.error = null;
            })
            .addCase(getAllAlertsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark All Alerts as Read
            .addCase(markAllAlertsAsReadThunk.fulfilled, (state, action) => {
                state.allAlerts = action.payload;
                state.error = null;
            })
            .addCase(markAllAlertsAsReadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
    }
});

export default alertSlice.reducer