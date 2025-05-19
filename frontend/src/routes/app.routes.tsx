import { RouteObject } from "react-router-dom";
import Home from "../pages/app/home/Home";
import Products from "../pages/app/products/Products";
import Product from "../pages/app/products/Product";
import Cart from "../pages/app/cart/Cart";
import Checkout from "../pages/app/checkout/Checkout";
import OrderConfirmation from "../pages/app/orders/Order";
import Profile from "../pages/app/userProfile/Profile";


const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/products',
        element: <Products/>
    },
    {
        path: '/products/:id',
        element: <Product/>
    },
    {
        path: '/cart',
        element:<Cart/>
    },
    {
        path: '/checkout',
        element:<Checkout/>
    },
    {
        path: '/order/:id',
        element:<OrderConfirmation/>
    },
    {
        path: '/profile',
        element:<Profile/>
    }
];

export default appRoutes;