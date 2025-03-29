import { RouteObject } from "react-router-dom";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Login from "../pages/auth/Login";


const authRoutes: RouteObject[] = [
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'forget-password',
        element: <ForgetPassword />
    }
]