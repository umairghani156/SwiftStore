import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ThemeState{
    theme: string
}
const INITIAL_STATE : ThemeState = {
    theme: localStorage.getItem("theme") || "forest",
}

const useThemeStorage = createSlice({
    name: "theme",
    initialState: INITIAL_STATE,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            localStorage.setItem("theme", action.payload);
            state.theme = action.payload
        }
    }
});

const { setTheme } = useThemeStorage.actions;

export { useThemeStorage, setTheme };