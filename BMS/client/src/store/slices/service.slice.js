import { createSlice } from "@reduxjs/toolkit";
import { getAllServices } from "../thunks/service.thunk";


const initialState = {
  service: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
        state.error = null;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default serviceSlice.reducer;

