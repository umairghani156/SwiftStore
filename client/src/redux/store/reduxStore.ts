import { configureStore, Reducer } from "@reduxjs/toolkit";
import { setTheme, useThemeStorage } from "../useThemeStore";

const store = configureStore({
    reducer:{
        theme: useThemeStorage.reducer
    }
});

export default store;