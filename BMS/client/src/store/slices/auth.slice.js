import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addUserThunk, deleteUserThunk, getAllTenantsThunk, getAllUsersThunk, login, updateUserThunk } from "../thunks/auth.thunk";


const initialState ={
    user: null,
    token:null,
    users: [],
    tenants: [],
    role: null,
    loading:false,
    error:null
}



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    },

    extraReducers:(builder)=>{
        builder
        .addCase(login.pending, (state)=>{
            state.loading = true,
            state.error= null
        })
        .addCase(login.fulfilled,(state, action)=>{
            state.loading = false;
            state.user = action.payload.data;
            state.token = action.payload.token;
            state.role = action.payload.data.role;
            state.error = null;
            localStorage.setItem("user", action.payload.data.role);
            localStorage.setItem("token", action.payload.token)
        })
        .addCase(login.rejected, (state, action)=>{
            state.loading = false;
            state.user = null;
            state.error = action.payload;
        })

        // Get ALL USERS
        .addCase(getAllUsersThunk.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllUsersThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.error = null;
        })

        // Get Tenants
        .addCase(getAllTenantsThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.tenants = action.payload;
            state.error = null;
        })

        // Add a User
        .addCase(addUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.users = [...state.users, action.payload.data];
            state.error = null;
        })

        // Update a User

        .addCase(updateUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.map((user) => {
                if (user._id === action.payload.data._id) {
                    return action.payload.data;
                }
                return user;
            });
            state.error = null;
        })
        .addCase(updateUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // Delete a User 
        .addCase(deleteUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.filter((user) => user._id !== action.payload._id);
            state.error = null;
        });
    }

})

export const {logout} = authSlice.actions;

export default authSlice.reducer