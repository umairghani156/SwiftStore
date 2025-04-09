import axios from "axios";
import toast from "react-hot-toast";
import {Navigate} from "react-router-dom"
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // If you're using cookies for authentication
});

// Request interceptor to add the token to each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];  // Don't set Content-Type for FormData
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;  
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (error.response.data.message === 'Token expired. Please log in again.') {
                toast.error(error.response.data.message);

                localStorage.removeItem('token');
                localStorage.removeItem('user');
               Navigate('/login');
            }

            // If you have a refresh token mechanism, you can handle it here
            // Example: Attempt to refresh the access token
            // const refreshToken = localStorage.getItem('refresh_token');
            // if (refreshToken) {
            //   try {
            //     const response = await axios.post('/refresh-token', { refreshToken });
            //     const newAccessToken = response.data.accessToken;
            //     localStorage.setItem('token', newAccessToken);
            //     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            //     return axios(originalRequest);  // Retry the original request with the new token
            //   } catch (refreshError) {
            //     // Handle refresh token failure (log out the user, redirect to login)
            //     localStorage.removeItem('token');
            //     localStorage.removeItem('refresh_token');
            //     window.location.href = '/login';
            //   }
            // }
        }

        return Promise.reject(error);
    }
);

export default api;
