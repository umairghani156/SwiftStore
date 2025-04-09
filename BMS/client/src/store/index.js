import { configureStore } from "@reduxjs/toolkit";
import { authSlice, issueSlice, serviceSlice,officeSlice, visitorSlice, alertSlice, appointmentSlice } from "./slices";


export const store = configureStore({
    reducer: {
        auth: authSlice,
        issue: issueSlice,
        service: serviceSlice,
        visitors: visitorSlice,
        office: officeSlice,
        alert: alertSlice,
        appointment: appointmentSlice

    },
});

export default store;