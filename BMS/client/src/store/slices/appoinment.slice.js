import { createSlice } from "@reduxjs/toolkit";
import { addVisitorAppoinmentThunk, getAllAppoinmentsThunk } from "../thunks/visitor.thunk";

const initialState = {
    appointments: null,
        loading: false,
        error: null
}
const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllAppoinmentsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllAppoinmentsThunk.fulfilled, (state, action) => {
            console.log(action.payload.visitors);
            state.appointments = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(getAllAppoinmentsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Add Appointment
        
        .addCase(addVisitorAppoinmentThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addVisitorAppoinmentThunk.fulfilled, (state, action) => {
            state.appointments.visitors = state.appointments.visitors ? [...state.appointments.visitors, action.payload] : [action.payload];
            state.loading = false;
            state.error = null;
        })
        .addCase(addVisitorAppoinmentThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export default appointmentSlice.reducer;