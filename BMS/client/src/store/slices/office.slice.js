import { createSlice } from "@reduxjs/toolkit";
import { getOfficeOccupancyThunk, getOfficeThunk } from "../thunks/office.thunk";

const initialState = {
    office: null,
    loading: false,
    officeOccupancy: null,
    error: null
}
const officeSlice = createSlice({
    name: 'office',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOfficeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOfficeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.office = action.payload;
                state.error = null;
            })
            .addCase(getOfficeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Office Occupancy
            .addCase(getOfficeOccupancyThunk.fulfilled, (state, action) => {
                state.officeOccupancy = action.payload;
                state.error = null;
            });
    }
});

export default officeSlice.reducer;