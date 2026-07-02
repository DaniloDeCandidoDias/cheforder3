'use client'
import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token') ?? store.getState().auth.token;

        if (token) {
            const headers = config.headers ?? new AxiosHeaders();
            headers.set('Authorization', `Bearer ${token}`);
            config.headers = headers;
        }

        return config;
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }

        return Promise.reject(error);
    }
);

export default api;
