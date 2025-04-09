import { createSlice } from "@reduxjs/toolkit";
import { addVisitorAppoinmentThunk, addVisitorThunk, checkInVisitorThunk, getAllAppoinmentsThunk, getAllVisitorsThunk, getHourlyVisitorFlowThunk, getVisitorAnalyticsThunk, getVisitorCountThunk, updateVisitorThunk } from "../thunks/visitor.thunk";

const initialState = {
    visitors: null,
    loading: false,
    visitorsStatistics: null,
    hourlyVisitors: null,
    visitorsAnalytics: null,
    appointments: null,
    checkInVisitor: null,
    error: null
};
const visitorSlice = createSlice({
    name: 'visitors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addVisitorThunk.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(addVisitorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.visitors = state.visitors ? [...state.visitors, action.payload] : [action.payload];
                state.error = null;
            })
            .addCase(addVisitorThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllVisitorsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllVisitorsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.visitors = action.payload;
                state.error = null;
            })
            .addCase(getAllVisitorsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Visitor Count
            .addCase(getVisitorCountThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVisitorCountThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.visitorsStatistics = action.payload;
                state.error = null;
            })
            .addCase(getVisitorCountThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

          
            .addCase(updateVisitorThunk.fulfilled, (state, action) => {
                state.loading = false;
              
                state.visitors.visitors = state.visitors.visitors.map((visitor) => {
                    if (visitor._id === action.payload._id) {
                        return { ...visitor, ...action.payload };
                    }
                    return visitor;
                });
                state.error = null;
            })
           
            // Hourly Visitor Flow
            .addCase(getHourlyVisitorFlowThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getHourlyVisitorFlowThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.hourlyVisitors = action.payload;
                state.error = null;
            })
            .addCase(getHourlyVisitorFlowThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Visitor Analytics
            .addCase(getVisitorAnalyticsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVisitorAnalyticsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.error = null;
            })
            .addCase(getVisitorAnalyticsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check In Visitor
            .addCase(checkInVisitorThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.checkInVisitor= action.payload;
                state.error = null;
            })

            // Get Visitor Appoinments

            

            

        
    }
});

export default visitorSlice.reducer;