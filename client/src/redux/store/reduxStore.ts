import { configureStore, Reducer } from "@reduxjs/toolkit";
import { setTheme, useThemeStorage } from "../useThemeStore";
import { productSlice } from "../useProductStore";

const store = configureStore({
    reducer:{
        theme: useThemeStorage.reducer,
        product: productSlice.reducer
    }
});

export default store;