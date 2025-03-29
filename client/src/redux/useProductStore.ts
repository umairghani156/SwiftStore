import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product{
    id: number,
    name: string,
    price: string,
    image: string,
    description: string,
    created_at: string,
};



interface ProductState{
    product: Product[],
    loading: boolean,
    error: any,
    currentProduct: Product
}
const INITIAL_STATE:ProductState = {
    product: [],
    loading: false,
    error: null,
    currentProduct: {} as Product,
};

export const getProduct = createAsyncThunk(
    "product/getProduct",
    async (id: string) => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}products/${id}`);
        return response.data.data;
    }
)

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async (product: Product) => {
        try {
             const response = await axios.put(`${import.meta.env.VITE_BASE_URL}products/${product.id}`, product);
            return response.data.data;
        } catch (error) {
            return error;
        }
    }
)

const productSlice = createSlice({
    name: "product",
    initialState: INITIAL_STATE,
    reducers: {
        productPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        productSuccess: (state, action) => {
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },
        productError: (state, action) => {
            state.error = action.payload.response.data.error;
            state.product = [];
            state.loading = false;
        },
        deleteProduct: (state, action) => {
            state.product = state.product.filter((product) => product.id !== action.payload);
        },
        addProduct: (state, action)=>{
            state.loading = false;
            state.product.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProduct.fulfilled, (state, action) => {
            state.currentProduct = action.payload;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.currentProduct = action.payload;
        })
        
    },
});

 const {productPending, productSuccess, productError, deleteProduct,addProduct, } = productSlice.actions;

export {productPending, productSuccess, productError, productSlice, deleteProduct,addProduct};
