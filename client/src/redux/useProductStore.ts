import { createSlice } from "@reduxjs/toolkit";

export interface Product{
    id: number,
    name: string,
    price: string,
    image: string,
    created_at: string,
};

// interface ProductState{
//     success: boolean,
//     data: Product[],
// }

interface ProductState{
    product: Product[],
    loading: boolean,
    error: any
}
const INITIAL_STATE:ProductState = {
    product: [],
    loading: false,
    error: null
};

const productSlice = createSlice({
    name: "product",
    initialState: INITIAL_STATE,
    reducers: {
        productPending: (state, action) => {
            state.loading = true;
        },
        productSuccess: (state, action) => {
            state.product = action.payload;
            state.loading = false;
        },
        productError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

 const {productPending, productSuccess, productError} = productSlice.actions;

export {productPending, productSuccess, productError, productSlice};